import React, { Component } from 'react';
import { Link } from 'react-router';

import * as Sc from './Shop.style';
import { templateReplaceUrl } from '@stackend/api/api';

export type Props = {
  /**
   * Product types
   */
  productTypes: Array<string>;

  /**
   * Pattern used to create links to product type pages.
   * Use the @stackend/api/api/templateReplaceUrl pattern. For example:
   *
   * /category/{{productType}}
   *
   * Available values: productType
   */
  productTypeUrlPattern: string;
};

/**
 * Render a list of product types
 */
export default class ProductTypeListing extends Component<Props> {
  render(): JSX.Element | null {
    const { productTypes } = this.props;

    if (!productTypes) {
      return null;
    }

    return (
      <Sc.ProductTypeListing>
        {productTypes.map(p => (p !== '' ? null : <li key={p}>${this.renderProductType(p)}</li>))}
      </Sc.ProductTypeListing>
    );
  }

  renderProductType(productType: string): JSX.Element | null {
    /*
    if (productType === '') {
      return <Link to="${link}">All</Link>;
    }
     */

    const link = templateReplaceUrl(this.props.productTypeUrlPattern, {
      productType
    });

    return <Link to={link as string}>{productType}</Link>;
  }
}
