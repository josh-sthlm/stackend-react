//@flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
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
import ProductTypeListing from './ProductTypeListing.tsx';
import * as Sc from './Shop.style.js';

export interface Props {
	requestProductsAndProductTypes: (req: ListProductsRequest) => Thunk<ListProductsAndTypesResult>;
	requestProduct: (req: GetProductRequest) => Thunk<GetProductResult>;
	shop: ShopState;
	dispatch: Dispatch;
}

function mapDispatchToProps(dispatch: Dispatch) {
	return {
		requestProductsAndProductTypes: (req: any) => dispatch(requestProductsAndProductTypes(req)),
		requestProduct: (req: any) => dispatch(requestProduct(req)),
		dispatch
	};
}

function mapStateToProps(
	{ shop, communities }: { shop: ShopState, communities: CommunityState },
	ownProps: Props
) {
	return {
		shop,
		community: communities.community
	};
}

class ShopApp extends Component<Props> {
	static async fetchData(dispatch: Dispatch, { params, shop }: Props) {
		// FIXME: Support categories
		// FIXME: Support page mode as well as module mode (hash link)
		let handle = params.handle;

		console.log(
			'fetchData, handle=',
			params.handle,
			', type=',
			params.productType,
			', shop=',
			shop
		);

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
			ShopApp.fetchData(this.props.dispatch, this.props);
		}
	}

	render() {
		const { shop } = this.props;
		return (
			<Sc.ShopApp>
				<ProductTypeListing productTypes={shop.productTypes} />
				{this.props.children}
			</Sc.ShopApp>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ShopApp);
