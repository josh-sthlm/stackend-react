import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ShopState } from '@stackend/api/shop/shopReducer';
import { requestProduct } from '@stackend/api/shop/shopActions';
import { Product as ProductType } from '@stackend/api/shop';
import Product from '../../shop/Product';
import ProductListingItem from '../../shop/ProductListingItem';
import * as Sc from './ProductModule.style';
import { getLinkFactory } from '../../link/LinkFactory';
import ShopLinkFactory from '../../shop/ShopLinkFactory';

function mapStateToProps(
  state: any,
  ownProps: any
): {
  product: ProductType | undefined;
} {
  const { handle } = ownProps;
  const shop: ShopState = state.shop;
  const product = shop.products[handle];

  return {
    product
  };
}

const mapDispatchToProps = {
  requestProduct
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export enum ProductLayoutOptions {
  FULL = 'full',
  COMPACT = 'compact',
  HORIZONTAL = 'horizontal'
}

type Props = ConnectedProps<typeof connector> & {
  handle: string;
  layout: ProductLayoutOptions;
  render?: (product: ProductType, layout: string) => JSX.Element;
  className?: string;
};

class ProductModule extends Component<Props> {
  componentDidMount(): void {
    // Backend may refuse to load all requested products. In that case, load it here
    const { product, requestProduct, handle } = this.props;
    if (!product && handle) {
      requestProduct({ handle: this.props.handle });
    }
  }

  render(): JSX.Element | null {
    const { product, layout, render, className } = this.props;

    if (!product) {
      return null;
    }

    const klass = 'stackend-shop-product-module-' + layout + (className ? ' ' + className : '');

    if (render) {
      return <Sc.ProductModule className={klass}>{render(product, layout)}</Sc.ProductModule>;
    }

    if (layout === ProductLayoutOptions.FULL) {
      return (
        <Sc.ProductModule className={klass}>
          <Product product={product} />
        </Sc.ProductModule>
      );
    }

    const linkFactory = getLinkFactory<ShopLinkFactory>('shop');

    return (
      <Sc.ProductModule className={klass}>
        <ProductListingItem product={product} link={linkFactory.createProductLink(product)} />
      </Sc.ProductModule>
    );
  }
}
export default connector(ProductModule);
