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

function mapStateToProps(state: any, ownProps: any): any {
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

type Props = ConnectedProps<typeof connector> & {
  handle: string;
  layout: 'full' | 'compact';
  render?: (product: ProductType, layout: string) => JSX.Element;
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
    const { product, layout, render } = this.props;

    if (!product) {
      return null;
    }

    if (render) {
      return <Sc.ProductModule>{render(product, layout)}</Sc.ProductModule>;
    }

    if (layout === 'full') {
      return (
        <Sc.ProductModule>
          <Product product={product} />
        </Sc.ProductModule>
      );
    }

    const linkFactory = getLinkFactory<ShopLinkFactory>('shop');

    return (
      <Sc.ProductModule>
        <ProductListingItem product={product} link={linkFactory.createProductLink(product)} />
      </Sc.ProductModule>
    );
  }
}
export default connector(ProductModule);
