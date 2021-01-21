import { ListProductsRequest, ProductSortKeys } from '@stackend/api/shop';
import { PageContent } from '@stackend/api/cms';

/**
 * Construct a ListProductsRequest from a PageContent
 * @param pc
 */
export function getListProductsRequest(pc: PageContent): ListProductsRequest {
  if (!pc || !pc.data) {
    return {};
  }

  return getListProductsRequestFromJsonString(pc.data);
}

/**
 * Construct a ListProductsRequest from a json string
 * @param json
 */
export function getListProductsRequestFromJsonString(json: string): ListProductsRequest {
  const d = JSON.parse(json);
  if (!d) {
    return {};
  }

  return getListProductsRequestFromJson(d);
}

/**
 * Construct a ListProductsRequest from a json object
 * @param d
 */
export function getListProductsRequestFromJson(d: any): ListProductsRequest {
  if (!d) {
    return {};
  }

  return {
    productTypes: d.productTypes,
    first: d.first,
    imageMaxWidth: d.imageMaxWidth,
    q: d.q,
    sort: d.sort || ProductSortKeys.RELEVANCE,
    tags: d.tags
  };
}
