import { ListProductsRequest, ProductVariant, SlimProduct } from '@stackend/api/shop';
import { LinkFactory } from '../link/LinkFactory';

export enum ListingContext {
  /**
   * A generic product listing (Typically "/products/...")
   */
  LISTING,

  /**
   * A product search (Typically "/search/...")
   */
  SEARCH,

  /**
   * A product type listing (Typically "/productType/TYPE/...")
   */
  PRODUCT_TYPE_LISTING
}

/**
 * A link factory for shop components
 */
export default interface ShopLinkFactory extends LinkFactory {
  /**
   * Create a link to a page with a product type listing.
   * When a string is supplied, it's the productType
   * @param req
   * @param listingContext
   */
  createProductListingLink(req: ListProductsRequest | string, listingContext: ListingContext): string;

  /**
   * Create a link to a product page with an optional product variant selected
   * @param product
   * @param productVariant
   */
  createProductLink(product: SlimProduct, productVariant?: ProductVariant | string): string;

  /**
   * Create a link to a page listing products by tags
   * @param tag
   * @param product
   */
  createProductTagSearchLink(tag: string, product: SlimProduct): string;
}
