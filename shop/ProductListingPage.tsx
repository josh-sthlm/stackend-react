import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import ProductListing from './ProductListing';
import { Thunk } from '@stackend/api/api';
import { getProductListing, requestProductsAndProductTypes } from '@stackend/api/shop/shopActions';
import { DEFAULT_PRODUCT_TYPE, ShopState } from '@stackend/api/shop/shopReducer';
import { ListProductsRequest, Product, ListProductsAndTypesResult } from '@stackend/api/shop';

export interface Props {
  productUrlPattern: string;
  productType: string;

  requestProductsAndProductTypes: (req: ListProductsRequest) => Thunk<ListProductsAndTypesResult>;
  products: Array<Product>;
}

const mapDispatchToProps = {
  requestProductsAndProductTypes
};

function mapStateToProps(state: any, ownProps: any) {
  const shop: ShopState = state.shop;
  const products = getProductListing(shop, { productTypes: [ownProps.productType || DEFAULT_PRODUCT_TYPE] });

  return {
    products
  };
}

class ProductListingPage extends Component<Props> {
  async componentDidMount(): Promise<any> {
    const { products, requestProductsAndProductTypes } = this.props;
    if (!products) {
      await requestProductsAndProductTypes({});
    }
  }

  render(): JSX.Element | null {
    const { products, productType, productUrlPattern } = this.props;

    return (
      <Fragment>
        <Helmet>
          <title>${productType} - Products</title>
        </Helmet>
        <ProductListing products={products} productUrlPattern={productUrlPattern} />
      </Fragment>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductListingPage);
