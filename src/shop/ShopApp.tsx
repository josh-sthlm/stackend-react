//@flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Thunk } from '@stackend/api/api';
import { requestProductsAndProductTypes, requestProduct } from '@stackend/api/shop/shopActions';
import { DEFAULT_PRODUCT_TYPE, ShopState } from '@stackend/api/shop/shopReducer';
import {
  ListProductsRequest,
  ListProductsAndTypesResult,
  GetProductRequest,
  GetProductResult
} from '@stackend/api/shop';
import { CommunityState } from '@stackend/api/stackend/communityReducer';
import ProductTypeListing from './ProductTypeListing';
import * as Sc from './Shop.style.js';

export interface Props {
  requestProductsAndProductTypes: (req: ListProductsRequest) => Thunk<ListProductsAndTypesResult>;
  requestProduct: (req: GetProductRequest) => Thunk<GetProductResult>;
  shop: ShopState;
  dispatch: any;
  params: any;
}

function mapDispatchToProps(dispatch: any, _getState: any) {
  return {
    requestProductsAndProductTypes: (req: any) => dispatch(requestProductsAndProductTypes(req)),
    requestProduct: (req: any) => dispatch(requestProduct(req)),
    dispatch
  };
}

function mapStateToProps({ shop, communities }: { shop: ShopState; communities: CommunityState }) {
  return {
    shop,
    community: communities.community
  };
}

class ShopApp extends Component<Props> {
  static async fetchData(dispatch: any, { params, shop }: Props) {
    // FIXME: Support categories
    // FIXME: Support page mode as well as module mode (hash link)
    let handle = params.handle;

    console.log('fetchData, handle=', params.handle, ', type=', params.productType, ', shop=', shop);

    // Product
    if (handle) {
      if (!shop || !shop.products[handle]) {
        return dispatch(requestProduct({ handle }));
      }
    } else {
      /* Category listing */
      let productType = params.productType || DEFAULT_PRODUCT_TYPE;
      if (!shop || !shop.productsByType[productType]) {
        return dispatch(requestProductsAndProductTypes({}));
      }
    }
  }

  componentDidMount() {
    ShopApp.fetchData(this.props.dispatch, this.props).then();
  }

  componentDidUpdate(prevProps: Props, prevState: any, prevContext: any) {
    let params = this.props.params;
    let prevParams = prevProps.params;

    if (params.handle !== prevParams.handle || params.productType !== prevParams.productType) {
      ShopApp.fetchData(this.props.dispatch, this.props).then();
    }
  }

  render() {
    const { shop } = this.props;
    return (
      <Sc.ShopApp>
        <ProductTypeListing productTypes={shop.productTypes} productTypeUrlPattern={'/category/${productType}'} />
        {this.props.children}
      </Sc.ShopApp>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShopApp);
