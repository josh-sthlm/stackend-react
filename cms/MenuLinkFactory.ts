import { LinkFactory } from '../link/LinkFactory';

import { Node } from '@stackend/api/api/tree';
import { SubSite, SubSiteNode } from '@stackend/api/cms';

export const MENU_COMPONENT = 'menu';

export default interface MenuLinkFactory extends LinkFactory {
  /**
   * Create a permalink for a menu item. Used for calculating selected path etc.
   * @param subSite
   * @param treePath
   * @param item
   */
  createPermalink(subSite: SubSite, treePath: Node[] | null, item: SubSiteNode | null): string;

  /**
   * Create a link for a menu item. This is the link presented to the user
   * @param subSite
   * @param treePath
   * @param item
   */
  createLink(subSite: SubSite, treePath: Node[] | null, item: SubSiteNode | null): string;
}
