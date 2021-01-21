import ShopLinkFactory, { ListingContext } from './ShopLinkFactory';
import { ListProductsRequest, ProductVariant, SlimProduct } from '@stackend/api/shop';
import { noEmptyParams } from '../link/LinkFactory';
import { createUrl } from '@stackend/api/api';

/**
 * A shop link factory that uses hash links
 */
export class HashShopLinkFactory implements ShopLinkFactory {
  getComponent(): string {
    return 'shop';
  }

  getName(): string {
    return 'HashShopLinkFactory';
  }

  createProductLink(product: SlimProduct, productVariant?: ProductVariant | string): string {
    return '#?product=' + product.handle;
  }

  createProductTagSearchLink(tag: string, product: SlimProduct): string {
    return '#?tag=' + encodeURIComponent(tag);
  }

  createProductListingLink(req: ListProductsRequest | string, listingContext: ListingContext): string {
    if (typeof req === 'string') {
      return '#?productType=' + encodeURIComponent(req);
    }

    const params = noEmptyParams(req);
    return createUrl({ path: '#', params });
  }
}

export const INSTANCE = new HashShopLinkFactory();

export default INSTANCE;
