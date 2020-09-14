import React, { Component, useRef } from 'react';
import ReactDOM from 'react-dom';
import {
  Page as CmsPage,
  Content as CmsContent,
  SubSite,
  MenuVisibility,
  getDefaultPageId,
  SubSiteNode,
  GetPagesResult
} from '@stackend/api/cms';
import _ from 'lodash';
import { Helmet } from 'react-helmet';
import Menu from './Menu';
import Page from './Page';
import { connect } from 'react-redux';
import {
  getSubSiteNodePermalink,
  getSubSitePageHashPermalink,
  requestPage,
  shouldFetchPage,
  SITE_HASH_PREFIX
} from '@stackend/api/cms/pageActions';
import { PagesState } from '@stackend/api/cms/pageReducer';
import { browserHistory } from 'react-router';
import { findNode, getNodePath, getTreePath, getTreePathMatch, getTreePermalink, Node } from '@stackend/api/api/tree';
import Content from './Content';
import { Request, AnchorType, getAnchorPart, parseAnchor } from '@stackend/api/request';
import { dispatchCustomEvent, EVENT_NAVIGATE_TO_PAGE } from '../util/ClientSideApi';

type Props = {
  subSite?: SubSite | null;
  menuVisibility?: MenuVisibility;
  helmet?: boolean;
  currentPageId: number;
  requestPage: (pageId: number) => Promise<GetPagesResult>;
  pages: PagesState;
  page: CmsPage | null;
  content: CmsContent | null /* Additional cms content added to the page */;
  defaultPageId: number;
  request: Request;
};

type State = {
  page: CmsPage | null;
  selectedPath: Array<SubSiteNode>;
  loading: boolean;
};

function mapStateToProps({ pages, cmsContent, request }: any, { subSite }: any): any {
  let defaultPageId = subSite ? getDefaultPageId(subSite) : null;

  let page = null;
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
    request
  };
}

const mapDispatchToProps = {
  requestPage
};

/**
 * Render a subsite
 */
class Subsite extends Component<Props, State> {
  pageRef = useRef(null);
  contentRef = useRef(null);

  constructor(props: Props) {
    super(props);
    this.state = {
      page: null,
      selectedPath: [],
      loading: false
    };
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    /* Sets up initial page and selection */
    if (!state.page && props.subSite && props.page) {
      let selectedPath = getTreePathMatch(
        props.subSite,
        (n: SubSiteNode) => n.referenceId === (props.page ? props.page.id : 0)
      );
      return {
        page: props.page,
        selectedPath
      };
    }

    return state;
  }

  componentDidMount() {
    this.setupLinkHandlers(this.contentRef, false);

    // On load, navigate to the page present in hash tag, if any
    const { request, subSite } = this.props;
    if (!subSite) {
      return;
    }

    let hash = request.location.hash;

    let anchor = parseAnchor(hash);
    let siteAnchor = getAnchorPart(anchor, AnchorType.SITE);
    if (siteAnchor) {
      let subSitePermalink = getTreePermalink(siteAnchor.sitePermalink || null);
      let pl = '/' + siteAnchor.permalink;
      if (subSitePermalink === subSite.permalink) {
        let n = getNodePath(subSite, pl);
        if (n) {
          //let href = getSubSitePageHashPermalink({ treePath: n });
          let href = hash;
          this.doNavigate(href, n[n.length - 1], n, false).then();
        }
      }
    } else {
      this.setupLinkHandlers(this.pageRef, true);
      const { page } = this.state;
      if (page) {
        let n = findNode(subSite, n => n.referenceId === page.id);
        let treePath = getTreePath(subSite, n as Node);
        let permalink = getSubSitePageHashPermalink({ treePath, permalink: null });

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

  render() {
    const { subSite, helmet, menuVisibility, content } = this.props;
    const { page, selectedPath, loading } = this.state;

    if (!subSite) {
      return null;
    }

    let title = '';
    let metaDescription = '';
    let useHelmet = typeof helmet === 'boolean' ? helmet : true;
    if (useHelmet && page) {
      title = page.name || '';
      metaDescription = page.metaDescription || '';
    }

    let c = Menu.getMenuVisibilityClass(menuVisibility);

    {
      /*
			 - Can not use styled components here, because the .stackend prefix is not in use.
			 - Do not apply stackend styling to Page, but to the menu
			*/
    }
    // @ts-ignore
    // @ts-ignore
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

        {content && <Content content={content} ref={this.contentRef} />}

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
              //@ts-ignore
              page={page as any}
              ref={this.pageRef as any}
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
  onNavigate = (e: Event, node: SubSiteNode, path: Array<SubSiteNode> | null) => {
    if (e.target && path) {
      let href = (e.target as HTMLAnchorElement).href;
      this.doNavigate(href, node, path, false);
    }
  };

  async doNavigate(href: string, node: SubSiteNode, path: Array<SubSiteNode>, scrollIntoView: boolean) {
    // FIXME: Handle links
    if (!node.ref) {
      return;
    }

    this.setState({
      loading: true
    });

    const { pages, requestPage, request, subSite } = this.props;
    const previousPage = this.state.page;
    let page = pages.byId[node.referenceId];

    let i = href.indexOf('#');
    if (i !== -1) {
      href = href.substring(i);
      href = request.location.pathname + href;
    }

    if (shouldFetchPage(page, Date.now())) {
      let r: GetPagesResult = await requestPage(node.referenceId);
      if (!r.error) {
        // @ts-ignore
        page = r.pages[node.referenceId];
      }
    }

    browserHistory.push(href);
    if (scrollIntoView && this.pageRef.current) {
      let parent = ReactDOM.findDOMNode(this.pageRef.current as any);
      if (parent) {
        console.log('Stackend: scrolling to', parent);
        (parent as Element).scrollIntoView();
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

  setupLinkHandlers = (ref: any, scrollOnClick: boolean) => {
    if (!ref || !ref.current) {
      return;
    }

    let parent = ReactDOM.findDOMNode(ref.current);
    if (!parent) {
      return;
    }
    let links = (parent as Element).querySelectorAll('a[href]');
    for (let i = 0; i < links.length; i++) {
      let l = links[i];
      let href = l.getAttribute('href');
      if (href && href.startsWith(SITE_HASH_PREFIX)) {
        l.addEventListener('click', (e: Event) => this.onContentLinkClicked(e, scrollOnClick));
      }
    }

    // FIXME: The old handlers needs to be removed
  };

  onContentLinkClicked = (e: Event, scrollOnClick: boolean) => {
    const { subSite } = this.props;

    if (!e.currentTarget || !subSite) {
      return;
    }

    let link = (e.currentTarget as Element).getAttribute('href');
    let pl = getSubSiteNodePermalink(link);
    if (!pl) {
      return;
    }

    let n = getNodePath(subSite, pl);
    if (!n) {
      return;
    }

    let href = getSubSitePageHashPermalink({ treePath: n, permalink: null });
    if (!href) {
      return;
    }

    this.doNavigate(href, n[n.length - 1], n, scrollOnClick).then();
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Subsite as any);