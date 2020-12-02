//@flow
import React, { MouseEvent } from 'react';
import { Link } from 'react-router';
import type { ListProductsRequest } from '@stackend/api/shop';
import * as Sc from './ShopPagination.style';
import { SlimProductListing } from '@stackend/api/shop/shopReducer';
import { nextPage, previousPage, PaginatedGraphQLRequest } from '@stackend/api/util/graphql';

export function ShopPagination({
  createPaginationLink,
  listing,
  onClick
}: {
  createPaginationLink: (req: PaginatedGraphQLRequest) => string;
  listing: SlimProductListing;
  onClick: (e: MouseEvent, newListProductsRequest: ListProductsRequest) => void;
}) {
  if (!listing) {
    return null;
  }

  let prevReq = previousPage(listing.selection, listing.previousCursor);
  let prevLink = createPaginationLink(prevReq);

  let nextReq = nextPage(listing.selection, listing.nextCursor);
  let nextLink = createPaginationLink(nextReq);

  return (
    <Sc.ShopPagination>
      {listing.hasPreviousPage && (
        <Link
          to={prevLink}
          onClick={e => {
            if (onClick) {
              onClick(e, prevReq);
            }
          }}>
          <i className="material-icons">arrow_backward</i>
        </Link>
      )}

      {listing.hasNextPage && (
        <Link
          to={nextLink}
          onClick={e => {
            if (onClick) {
              onClick(e, nextReq);
            }
          }}>
          <i className="material-icons">arrow_forward</i>
        </Link>
      )}
    </Sc.ShopPagination>
  );
}
