//@flow
import React, { MouseEvent } from 'react';
import { Link } from 'react-router';
import type { ListProductsRequest } from '@stackend/api/shop';
import * as Sc from './ShopPagination.style';
import { SlimProductListing } from '@stackend/api/shop/shopReducer';
import { nextPage, previousPage, PaginatedGraphQLRequest } from '@stackend/api/util/graphql';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';

function ShopPagination({
  createPaginationLink,
  listing,
  onClick
}: {
  createPaginationLink: (req: PaginatedGraphQLRequest) => string;
  listing: SlimProductListing | null;
  onClick?: (e: MouseEvent, newListProductsRequest: ListProductsRequest) => void;
} & WrappedComponentProps): JSX.Element | null {
  if (!listing) {
    return null;
  }

  const prevReq = previousPage(listing.selection, listing.previousCursor || '');
  const prevLink = createPaginationLink(prevReq);

  const nextReq = nextPage(listing.selection, listing.nextCursor || '');
  const nextLink = createPaginationLink(nextReq);

  return (
    <Sc.ShopPagination>
      {listing.hasPreviousPage && (
        <Link className="stackend-shop-previous"
          to={prevLink}
          onClick={(e): void => {
            if (onClick) {
              onClick(e, prevReq);
            }
          }}>
          <i className="material-icons">arrow_backward</i>
          <span className="stackend-shop-pagination-label">
            <FormattedMessage id="shop.pagination.previous" defaultMessage="Previous"/>
          </span>
        </Link>
      )}

      {listing.hasNextPage && (
        <Link
          to={nextLink}
          onClick={(e): void => {
            if (onClick) {
              onClick(e, nextReq);
            }
          }}>
          <span className="stackend-shop-pagination-label">
            <FormattedMessage id="shop.pagination.next" defaultMessage="Next"/>
          </span>
          <i className="material-icons">arrow_forward</i>
        </Link>
      )}
    </Sc.ShopPagination>
  );
}

export default injectIntl(ShopPagination);
