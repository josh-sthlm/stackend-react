
import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { requestProduct } from '@stackend/api/shop/shopActions';

import {
	Product as ProductType,
	GetProductRequest,
	GetProductResult,
	getFirstImage,
} from '@stackend/api/shop';
import { Thunk } from '@stackend/api/api';
import Product from './Product';
import { ProductMissingError } from './Shop.style.js';
import _ from 'lodash';

export interface PropsType {
	handle: string;
	requestProduct: (req: GetProductRequest) => Thunk<GetProductResult>;
	productLoaded: boolean;
	product: ProductType
}

const mapDispatchToProps = {
    requestProduct
}

function mapStateToProps({ shop }: any, ownProps: any) {
	let handle = _.get(ownProps, 'params.handle', '*');
	let product = shop.products[handle];
	let productLoaded = typeof shop.products[handle] !== 'undefined';
	return {
		handle,
		product,
		productLoaded
	};
}

class ProductPage extends Component<PropsType> {
	async componentDidMount() {
		const { product, requestProduct, handle } = this.props;
		if (!product) {
			await requestProduct({ handle });
		}
	}

	render() {
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