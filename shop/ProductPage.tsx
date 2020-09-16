import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { requestProduct } from '@stackend/api/shop/shopActions';

import { Product as ProductType, GetProductRequest, GetProductResult, getFirstImage } from '@stackend/api/shop';
import { Thunk } from '@stackend/api/api';
import Product from './Product';
import { ProductMissingError } from './Shop.style.js';
import get from 'lodash/get';

export interface PropsType {
  handle: string;
  requestProduct: (req: GetProductRequest) => Thunk<GetProductResult>;
  productLoaded: boolean;
  product: ProductType;
}

const mapDispatchToProps = {
  requestProduct
};

function mapStateToProps({ shop }: any, ownProps: any): any {
  const handle = get(ownProps, 'params.handle', '*');
  const product = shop.products[handle];
  const productLoaded = typeof shop.products[handle] !== 'undefined';
  return {
    handle,
    product,
    productLoaded
  };
}

class ProductPage extends Component<PropsType> {
  async componentDidMount(): Promise<any> {
    const { product, requestProduct, handle } = this.props;
    if (!product) {
      await requestProduct({ handle });
    }
  }

  render(): JSX.Element | null {
    const { product, productLoaded } = this.props;

    if (!productLoaded) {
      return null;
    }

    if (!product) {
      return (
        <Fragment>
          <Helmet>
            <title>Produkten finns inte</title>
          </Helmet>
          <ProductMissingError>Produkten finns inte</ProductMissingError>
        </Fragment>
      );
    }

    const image = getFirstImage(product);

    return (
      <Fragment>
        <Helmet>
          <title>{product.title}</title>
          <meta property="og:title" content={product.title} />
          {image && <meta property="og:image" content={image.transformedSrc} />}
        </Helmet>
        <Product product={product} />
      </Fragment>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductPage);
