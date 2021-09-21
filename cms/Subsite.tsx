import React, { Component, MouseEvent } from 'react';
import {
  Page as CmsPage,
  SubSite,
  MenuVisibility,
  getDefaultPageId,
  SubSiteNode,
  GetPagesResult
} from '@stackend/api/cms';
import { Helmet } from 'react-helmet';
import Menu from './Menu';
import Page from './Page';
import { connect, ConnectedProps } from 'react-redux';
import {
  getSubSiteNodePermalink,
  getSubSitePageHashPermalink,
  requestPage,
  shouldFetchPage,
  SITE_HASH_PREFIX
} from '@stackend/api/cms/pageActions';
// React router 3
//import { browserHistory } from 'react-router-dom';
import { withRouter, RouteComponentProps } from 'react-router';
import { findNode, getNodePath, getTreePath, getTreePathMatch, getTreePermalink, Node } from '@stackend/api/api/tree';
import Content from './Content';
import { AnchorType, getAnchorPart, parseAnchor } from '@stackend/api/request';
import { dispatchCustomEvent, EVENT_NAVIGATE_TO_PAGE } from '../util/ClientSideApi';

function mapStateToProps({ pages, cmsContent, request }: any, { subSite, history }: any) {
  const defaultPageId = subSite ? getDefaultPageId(subSite) : null;

  let page: CmsPage | null = null;
  if (defaultPageId) {
    page = pages.byId[defaultPageId];
  }

  let content = null;
  if (subSite && subSite.data.cmsId) {
    content = cmsContent[subSite.data.cmsId];
  }

  return {
    pages,
    page,
    defaultPageId,
    content,
    request,
    history
  };
}

const mapDispatchToProps = {
  requestPage
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> &
  RouteComponentProps & {
    subSite?: SubSite | null;
    menuVisibility?: MenuVisibility;
    helmet?: boolean;
    currentPageId: number;
  };

type State = {
  page: CmsPage | null;
  selectedPath: Array<SubSiteNode>;
  loading: boolean;
};

/**
 * Render a sub site
 */
class Subsite extends Component<Props, State> {
  pageRef: HTMLElement | undefined;
  contentRef: HTMLElement | undefined;

  constructor(props: Props) {
    super(props);
    this.state = {
      page: null,
      selectedPath: [],
      loading: false
    };
  }

  static getDerivedStateFromProps(props: Props, state: State): any {
    /* Sets up initial page and selection */
    if (!state.page && props.subSite && props.page) {
      const selectedPath = getTreePathMatch(
        props.subSite,
        (n: SubSiteNode) => n.referenceId === (props.page ? props.page.id : 0)
      );
      return {
        page: props.page,
        selectedPath: selectedPath || []
      };
    }

    return state;
  }

  componentDidMount(): void {
    this.setupLinkHandlers(this.contentRef, false);

    // On load, navigate to the page present in hash tag, if any
    const { request, subSite } = this.props;
    if (!subSite) {
      return;
    }

    const hash = request.location.hash;
    const anchor = parseAnchor(hash);
    const siteAnchor = getAnchorPart(anchor, AnchorType.SITE);
    if (siteAnchor) {
      const subSitePermalink = getTreePermalink(siteAnchor.sitePermalink || null);
      const pl = '/' + siteAnchor.permalink;
      if (subSitePermalink === subSite.permalink) {
        const n = getNodePath(subSite, pl);
        if (n) {
          //let href = getSubSitePageHashPermalink({ treePath: n });
          const href = hash;
          this.doNavigate(href, n[n.length - 1], n, false).then();
        }
      }
    } else {
      this.setupLinkHandlers(this.pageRef, true);
      const { page } = this.state;
      if (page) {
        const n = findNode(subSite, n => n.referenceId === page.id);
        const treePath = getTreePath(subSite, n as Node);
        const permalink = getSubSitePageHashPermalink({ treePath, permalink: null });

        dispatchCustomEvent(document, EVENT_NAVIGATE_TO_PAGE, false, false, {
          previousPage: null,
          page,
          subSite,
          href: request.location.pathname + (permalink ? permalink : '')
        });
      } else {
        // FIXME: desperate workaround
        console.log('Stackend: Page not available');
      }
    }
  }

  render(): JSX.Element | null {
    const { subSite, helmet, menuVisibility, content } = this.props;
    const { page, selectedPath, loading } = this.state;

    if (!subSite) {
      return null;
    }

    let title = '';
    let metaDescription = '';
    const useHelmet = typeof helmet === 'boolean' ? helmet : true;
    if (useHelmet && page) {
      title = page.name || '';
      metaDescription = page.metaDescription || '';
    }

    const c = Menu.getMenuVisibilityClass(menuVisibility);

    {
      /*
			 - Can not use styled components here, because the .stackend prefix is not in use.
			 - Do not apply stackend styling to Page, but to the menu
			*/
    }

    return (
      <div
        className={'stackend-site ' + c + (loading ? ' stackend-site-loading' : '')}
        id={'stackend-site-' + subSite.permalink}>
        {useHelmet && page && (
          <Helmet>
            <title>{title}</title>
            <meta property="og:title" content={title} />
            {metaDescription && <meta property="og:description" content={metaDescription} />}
            {metaDescription && <meta name="description" content={metaDescription} />}
            {page.ogImageUrl && <meta property="og:image" content={page.ogImageUrl} />}
          </Helmet>
        )}

        {content && (
          <Content
            content={content}
            setRef={(r: HTMLElement): void => {
              this.contentRef = r;
            }}
          />
        )}

        <div className="stackend-site-wrapper">
          <div className="stackend stackend-menu-container">
            <Menu
              subSite={subSite}
              selectedPath={selectedPath}
              onNavigate={this.onNavigate}
              menuVisibility={menuVisibility}
            />
          </div>

          {page && (
            <Page
              // @ts-ignore FIXME: What's up with the validation?
              page={page as CmsPage}
              setRef={(r: HTMLElement): void => {
                this.pageRef = r;
              }}
              helmet={true}
              parentHashLink={'/site/' + subSite.permalink + '/' + page.permalink}
            />
          )}
        </div>
      </div>
    );
  }

  /**
   * Handles navigation from the menu
   */
  onNavigate = (e: Event, node: SubSiteNode, path: Array<SubSiteNode> | null): void => {
    if (e.target && path) {
      const href = (e.target as HTMLAnchorElement).href;
      this.doNavigate(href, node, path, false).then();
    }
  };

  async doNavigate(href: string, node: SubSiteNode, path: Array<SubSiteNode>, scrollIntoView: boolean): Promise<void> {
    // FIXME: Handle links
    if (!node.ref) {
      return;
    }

    this.setState({
      loading: true
    });

    const { pages, requestPage, request, subSite, history } = this.props;
    const previousPage = this.state.page;
    let page = pages.byId[node.referenceId];

    const i = href.indexOf('#');
    if (i !== -1) {
      href = href.substring(i);
      href = request.location.pathname + href;
    }

    if (shouldFetchPage(page, Date.now())) {
      const r: GetPagesResult = await requestPage(node.referenceId);
      if (!r.error) {
        const p = r.pages[node.referenceId];
        if (p) {
          page = {
            ...p,
            loaded: Date.now()
          };
        }
      }
    }

    history.push(href);
    // React router 4
    //this.context.router.history.push(href);
    // React router 3
    // browserHistory.push(href);

    if (scrollIntoView && this.pageRef) {
      const parent = this.pageRef;
      if (parent) {
        console.log('Stackend: scrolling to', parent);
        parent.scrollIntoView();
      }
    }

    this.setState(
      {
        page,
        selectedPath: path,
        loading: false
      },
      () => {
        this.setupLinkHandlers(this.pageRef, true);
        dispatchCustomEvent(document, EVENT_NAVIGATE_TO_PAGE, false, false, {
          previousPage,
          page,
          subSite,
          href
        });
      }
    );
  }

  setupLinkHandlers = (ref: HTMLElement | null | undefined, scrollOnClick: boolean): void => {
    if (!ref) {
      return;
    }
    const parent = ref;
    const links = parent.querySelectorAll('a[href]');
    for (let i = 0; i < links.length; i++) {
      const l = links[i];
      const href = l.getAttribute('href');
      if (href && href.startsWith(SITE_HASH_PREFIX)) {
        l.addEventListener('click', (e: any) => this.onContentLinkClicked(e as MouseEvent, scrollOnClick));
      }
    }

    // FIXME: The old handlers needs to be removed
  };

  onContentLinkClicked = (e: MouseEvent, scrollOnClick: boolean): void => {
    const { subSite } = this.props;

    if (!e.currentTarget || !subSite) {
      return;
    }

    const link = (e.currentTarget as Element).getAttribute('href');
    const pl = getSubSiteNodePermalink(link);
    if (!pl) {
      return;
    }

    const n = getNodePath(subSite, pl);
    if (!n) {
      return;
    }

    const href = getSubSitePageHashPermalink({ treePath: n, permalink: null });
    if (!href) {
      return;
    }

    this.doNavigate(href, n[n.length - 1], n, scrollOnClick).then();
  };
}
export default connector(withRouter(Subsite));
