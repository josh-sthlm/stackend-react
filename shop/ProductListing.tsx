//@flow
import React, { Component } from 'react';

import * as Sc from './ProductListing.style';
import { SlimProduct } from '@stackend/api/shop';

import ProductListingItem from './ProductListingItem';
import { ProductListingItem as ScProductListingItem } from './ProductListingItem.style';

export interface Props {
  /**
   * List of products
   */
  products: Array<SlimProduct> | null;

  /**
   * Function invoked to create links to products
   * @param product
   */
  createProductLink: (product: SlimProduct) => string;

  /**
   * Show this number of placeholders while loading
   */
  placeholders?: number;

  /**
   * Optional method to render a product
   */
  renderProduct?: ({ product, link }: { product: SlimProduct; link: string }) => JSX.Element;
}

/**
 * Render a list of products
 */
export default class ProductListing extends Component<Props> {
  static defaultProps = {
    placeholders: 10
  };

  render(): JSX.Element | null {
    const { products } = this.props;

    if (!products) {
      return this.renderPlaceholder();
    }

    if (products.length === 0) {
      return null;
    }

    return (
      <Sc.ProductListing>
        <Sc.Products>{products.map(this.renderProduct)}</Sc.Products>
      </Sc.ProductListing>
    );
  }

  renderProduct = (product: SlimProduct): JSX.Element | null => {
    const link = this.props.createProductLink(product);
    const r = this.props.renderProduct ? this.props.renderProduct : this.defaultRenderProduct;
    return <li key={product.id}>{r({ product, link })}</li>;
  };

  defaultRenderProduct = ({ product, link }: { product: SlimProduct; link: string }): JSX.Element | null => {
    return <ProductListingItem product={product} link={link} />;
  };

  renderPlaceholder = (): JSX.Element | null => {
    const c = [];
    const { placeholders } = this.props;
    if (!placeholders) {
      return null;
    }
    for (let i = 0; i < placeholders; i++) {
      c.push(
        <li key={i}>
          <ScProductListingItem />
        </li>
      );
    }

    return (
      <Sc.ProductListing className="stackend-product-listing-placeholder">
        <Sc.Products>{c}</Sc.Products>
      </Sc.ProductListing>
    );
  };
}
