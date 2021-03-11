//@flow

import React, { Fragment } from 'react';
import * as Sc from './ProductTypeBreadCrumbs.style';
import { getProductTypeLabel } from '@stackend/api/shop/shopActions';
import { getParentProductType } from '@stackend/api/shop/ProductTypeTree';
import { Link } from 'react-router';
import { getLinkFactory } from '../link/LinkFactory';
import ShopLinkFactory, { ListingContext } from './ShopLinkFactory';

export default function ProductTypeBreadCrumbs({
  productType,
  listingContext
}: {
  /**
   * Product type
   */
  productType: string | null;
  listingContext: ListingContext;
}): JSX.Element | null {
  if (!productType) {
    return null;
  }

  const v: Array<string> = [];
  v.unshift(productType);

  let l = getParentProductType(productType);
  while (l) {
    v.unshift(l);
    l = getParentProductType(l);
  }

  const linkFactory = getLinkFactory<ShopLinkFactory>('shop');

  return (
    <Sc.ProductTypeBreadCrumbs>
      {v.map((t, index) => {
        const link = linkFactory.createProductListingLink(t, listingContext);

        return (
          <Fragment key={t}>
            {index !== 0 && <i className="material-icons">navigate_next</i>}
            <Link to={link}>{getProductTypeLabel(t)}</Link>
          </Fragment>
        );
      })}
    </Sc.ProductTypeBreadCrumbs>
  );
}
