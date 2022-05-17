import MenuLinkFactory, { MENU_COMPONENT } from './MenuLinkFactory';
import { getPermalink, Node } from '@stackend/api/api/tree';
import { SubSite, SubSiteNode } from '@stackend/api/cms';
import { getSubSitePageHashPermalink } from '@stackend/api/cms/pageActions';

/**
 * Default implementation of a MenuLinkFactory. Returns the permalink derived from the tree path using @stackend/api/api/tree/getPermalink
 */
export class DefaultMenuLinkFactory implements MenuLinkFactory {
  getComponent(): string {
    return MENU_COMPONENT;
  }

  getName(): string {
    return 'DefaultMenuLinkFactory';
  }

  createPermalink(subSite: SubSite, treePath: Node[] | null, item: SubSiteNode | null): string {
    return treePath ? getPermalink(treePath) : '';
  }

  createLink(subSite: SubSite, treePath: Node[] | null, item: SubSiteNode | null): string {
    let permalink: string | null = treePath ? getPermalink(treePath) : '';

    if (item) {
      if (item.ref !== null) {
        permalink = getSubSitePageHashPermalink({ permalink, treePath: null });
      } else if (item.data.link != null) {
        permalink = item.data.link;
      }
    }

    return permalink || '';
  }
}

export const INSTANCE = new DefaultMenuLinkFactory();

export default INSTANCE;
