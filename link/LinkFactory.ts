import HashShopLinkFactory from '../shop/HashShopLinkFactory';

/**
 * Base interface for all link factories
 */
export interface LinkFactory {
  /** Get the name of the implementation */
  getName(): string;

  /** Get the component */
  getComponent(): string;
}

const LINK_FACTORIES: { [component: string]: LinkFactory } = {
  shop: HashShopLinkFactory
};

/**
 * Get the LinkFactory for a component.
 * @param component
 */
export function getLinkFactory<T extends LinkFactory>(component: string): T {
  const f = LINK_FACTORIES[component];
  if (!f) {
    throw Error('No link factory for component "' + component + '" is set up');
  }
  return f as T;
}

/**
 * Get all components
 */
export function getComponents(): Array<string> {
  return Object.keys(LINK_FACTORIES);
}

/**
 * Set the LinkFactory for a component
 * @param linkFactory
 */
export function registerLinkFactory(linkFactory: LinkFactory): void {
  LINK_FACTORIES[linkFactory.getComponent()] = linkFactory;
}

/**
 * Remove empty params
 * @param params
 */
export function noEmptyParams(params: Object): { [key: string]: string } | undefined {
  if (!params) return undefined;

  let o: { [key: string]: string } = {};
  for (let key of Object.keys(params)) {
    let v = (params as any)[key];
    if (typeof v === 'undefined' || v === '' || (Array.isArray(v) && v.length === 0)) {
    } else {
      o[key] = v;
    }
  }
  return o;
}
