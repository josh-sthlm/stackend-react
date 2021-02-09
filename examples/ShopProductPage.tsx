import React, { Component } from 'react';

import ProductModule from '../cms/page-content/ProductModule';

type Props = Record<string, never>;

export default class ShopProductPage extends Component<Props> {
  render(): JSX.Element {
    return (
      <div>
        <h1>Display a compact product</h1>
        <div style={{ width: '20em' }}>
          <ProductModule handle="snare-boot" layout="compact" style={{ width: '20em' }} />
        </div>
        <h1>Display a full product</h1>
        <ProductModule handle="snare-boot" layout="full" />
      </div>
    );
  }
}
