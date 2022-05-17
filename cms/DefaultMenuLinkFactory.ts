import MenuLinkFactory, { MENU_COMPONENT } from './MenuLinkFactory';
import { getPermalink, Node } from '@stackend/api/api/tree';
import { SubSite, SubSiteNode } from '@stackend/api/cms';

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

  createPermalink(subSite: SubSite, treePath: Node[], item: SubSiteNode | null): string {
    return treePath ? getPermalink(treePath) : '';
  }
}

export const INSTANCE = new DefaultMenuLinkFactory();

export default INSTANCE;
