import React, { Component } from 'react';

import ProductListingModule from '../cms/page-content/ProductListingModule';

type Props = Record<string, never>;

export default class ShopProductListingPage extends Component<Props> {
  render(): JSX.Element {
    return (
      <div>
        <h1>Display a product listing</h1>
        <ProductListingModule
          listProductsRequest={{
            first: 4
          }}
          layout="list"
        />
      </div>
    );
  }
}
