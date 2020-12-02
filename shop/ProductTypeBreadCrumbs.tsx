//@flow

import React, { Fragment } from 'react';
import * as Sc from './ProductTypeBreadCrumbs.style';
import { getProductTypeLabel } from '@stackend/api/shop/shopActions';
import { getParentProductType } from '@stackend/api/shop/ProductTypeTree';
import { Link } from 'react-router';

export default function ProductTypeBreadCrumbs({
  productType,
  createProductTypeListingLink
}: {
  /**
   * Product type
   */
  productType: string | null;

  /**
   * Function used to create links to product type pages.
   */
  createProductTypeListingLink: (productType: string) => string;
}) {
  if (!productType) {
    return null;
  }

  let v: Array<string> = [];
  v.unshift(productType);

  let l = getParentProductType(productType);
  while (l) {
    v.unshift(l);
    l = getParentProductType(l);
  }

  return (
    <Sc.ProductTypeBreadCrumbs>
      {v.map((t, index) => {
        const link = createProductTypeListingLink(t);

        return (
          <Fragment key={t}>
            {index !== 0 && <i className="material-icons">trending_flat</i>}
            <Link to={link}>{getProductTypeLabel(t)}</Link>
          </Fragment>
        );
      })}
    </Sc.ProductTypeBreadCrumbs>
  );
}
