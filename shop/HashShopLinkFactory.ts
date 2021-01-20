import ShopLinkFactory, { ListingContext } from './ShopLinkFactory';
import { ListProductsRequest, ProductVariant, SlimProduct } from '@stackend/api/shop';

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

    return '#?fixme';
  }
}

export const INSTANCE = new HashShopLinkFactory();

export default INSTANCE;
