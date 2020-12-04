import React, { Component } from 'react';
import { PageContent } from '@stackend/api/cms';
import * as Cms from '@stackend/api/cms';
import { ModuleType } from '@stackend/api/stackend/modules';
import Content from './Content';
import { Helmet } from 'react-helmet';
//import GroupPage from '../group/GroupPage.jsx';
//import CommentsPage from '../comments/CommentsPage.jsx';
import { connect, ConnectedProps } from 'react-redux';

function mapStateToProps({ request }: any): any {
  return {
    referenceUrlId: request.referenceUrlId
  };
}

const connector = connect(mapStateToProps);

export interface Props extends ConnectedProps<typeof connector> {
  page: Cms.Page | null;
  titleSuffix?: string;
  helmet?: boolean;
  parentHashLink?: string;
}

/**
 * Render a page
 */
class Page extends Component<Props> {
  render(): JSX.Element | null {
    const { page, titleSuffix, helmet } = this.props;
    if (!page) {
      return null;
    }

    let title = page.name || '';
    if (titleSuffix) {
      title += titleSuffix;
    }

    const metaDescription = page.metaDescription;

    const useHelmet = typeof helmet === 'undefined' || helmet;

    return (
      <div className="stackend-page" id={'stackend-page-' + page.id}>
        {useHelmet && (
          <Helmet>
            <title>{title}</title>
            <meta property="og:title" content={title} />
            {metaDescription && <meta property="og:description" content={metaDescription} />}
            {metaDescription && <meta name="description" content={metaDescription} />}
            {page.ogImageUrl && <meta property="og:image" content={page.ogImageUrl} />}
          </Helmet>
        )}
        {page.content.map(this.renderPageContent)}
      </div>
    );
  }

  getPageContentClass(pc: PageContent): string {
    const type = 'stackend-page-content-' + pc.type.replace('stackend-', '');

    let c = 'stackend-page-content ' + type;

    const r = pc.reference;
    if (r) {
      c += ' ' + type + r.substring(r.lastIndexOf('-'));
    }

    /*
		if (pc.referenceRef && pc.referenceRef.permalink) {
			c += ' ' + type + '-' + pc.referenceRef.permalink;
		}*/

    return c;
  }

  renderPageContent = (pc: PageContent, i: number): JSX.Element | null => {
    const { page /*referenceUrlId, parentHashLink*/ } = this.props;
    const obj = pc.referenceRef;
    const key = 'pc-' + (page as Cms.Page).id + '-' + i;

    if (!pc.visible) {
      return null;
    }

    const className = this.getPageContentClass(pc);

    if (!obj) {
      console.error('stackend: Content ' + pc.reference + ' missing for Page ' + (page as Cms.Page).id);
      return null;
    }

    switch (pc.type) {
      case ModuleType.CMS:
        // Not wrapped in stackend class. Styling totally up to owner
        return <Content content={pc.referenceRef} key={key} className={className} />;

      case ModuleType.FEED:
        return null;
      /* FIXME: re add feed
				return (
					<div className={'stackend ' + className} key={key}>
						<GroupPage
							groupPermalink={pc.referenceRef.permalink}
							groupType={'groups'}
							useHelmet={false}
							parentHashLink={parentHashLink}
						/>
					</div>
				);*/

      case ModuleType.BLOG:
        return null;
      /* FIXME: Re add blog
				return (
					<div className={'stackend ' + className} key={key}>
						<GroupPage
							groupPermalink={pc.referenceRef.permalink}
							groupType={'blog'}
							useHelmet={false}
							parentHashLink={parentHashLink}
						/>
					</div>
				);
			   */

      case ModuleType.COMMENTS: {
        return null;
        /* FIXME: re add comments
				// Needs to include hash / page
				// FIXME: This is a hack
				let hashReferenceUrlId = 1000000 * referenceUrlId + 100 * page.id + i;
				return (
					<div className={'stackend ' + className} key={key}>
						<CommentsPage
							referenceGroupId={pc.referenceRef.id}
							referenceId={hashReferenceUrlId}
							stackendModule={pc.referenceRef}
							parentHashLink={parentHashLink}
						/>
					</div>
				);
			   */
      }

      default:
        // FIXME: Handle different types
        return (
          <div className="stackend" key={key}>
            {pc.name} - {pc.type} - {pc.reference} Not supported
          </div>
        );
    }
  };
}

export default connector(Page);
