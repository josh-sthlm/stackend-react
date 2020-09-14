import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import ProductListing from './ProductListing';
import { Thunk } from '@stackend/api/api';
import { requestProductsAndProductTypes } from '@stackend/api/shop/shopActions';
import { DEFAULT_PRODUCT_TYPE, ShopState } from '@stackend/api/shop/shopReducer';
import { ListProductsRequest, Product, ListProductsAndTypesResult, GraphQLList } from '@stackend/api/shop';

export interface Props {
  productUrlPattern: string;
  requestProductsAndProductTypes: (req: ListProductsRequest) => Thunk<ListProductsAndTypesResult>;
  products: GraphQLList<Product>;
  productType: string;
}

const mapDispatchToProps = {
  requestProductsAndProductTypes
};

function mapStateToProps(state: any, ownProps: any) {
  const shop: ShopState = state;
  const productType = DEFAULT_PRODUCT_TYPE; // FIXME: support categories
  const products = shop.productsByType[productType];

  return {
    productType,
    products
  };
}

class ProductListingPage extends Component<Props> {
  async componentDidMount() {
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
