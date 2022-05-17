import { LinkFactory } from '../link/LinkFactory';

import { Node } from '@stackend/api/api/tree';
import { SubSite, SubSiteNode } from '@stackend/api/cms';

export const MENU_COMPONENT = 'menu';

export default interface MenuLinkFactory extends LinkFactory {
  /**
   * Create a link for a menu item
   * @param subSite
   * @param treePath
   * @param item
   */
  createPermalink(subSite: SubSite, treePath: Node[], item: SubSiteNode | null): string;
}
