
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import ProductListing from './ProductListing';
import { Thunk } from '@stackend/api/api';
import { Dispatch } from "redux";
import { requestProductsAndProductTypes } from '@stackend/api/shop/shopActions';
import { DEFAULT_PRODUCT_TYPE, ShopState } from '@stackend/api/shop/shopReducer';
import {
	ListProductsRequest,
	Product,
	ListProductsAndTypesResult
} from '@stackend/api/shop';
import { COMMUNITY_PARAMETER } from '@stackend/api/api';
import { FIXME_HARDCODED_COMMUNITY } from './ShopApp.js';

export interface Props {
	requestProductsAndProductTypes: (req: ListProductsRequest) => Thunk<ListProductsAndTypesResult>,
	products: Array<Product>
}


function mapDispatchToProps(dispatch: Dispatch) {
	return {
		requestProductsAndProductTypes: (req: any) => dispatch(requestProductsAndProductTypes(req))
	};
}

function mapStateToProps({ shop }: { shop: ShopState }, ownProps: Props) {
	let productType = DEFAULT_PRODUCT_TYPE; // FIXME: support categories
	let products = shop.productsByType[productType];

	return {
		products
	};
}

class ProductListingPage extends Component<Props> {
	async componentDidMount() {
		const { products, requestProductsAndProductTypes } = this.props;
		if (!products) {
			await requestProductsAndProductTypes({ [COMMUNITY_PARAMETER]: FIXME_HARDCODED_COMMUNITY });
		}
	}

	render() {
		const { products } = this.props;

		return (
			<Fragment>
				<Helmet>
					<title>[FIXME: category] - Products</title>
				</Helmet>
				<ProductListing products={products} />
			</Fragment>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductListingPage);
