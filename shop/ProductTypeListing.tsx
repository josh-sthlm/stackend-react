
import React, { Component } from 'react';
import { Link } from 'react-router';

import * as Sc from './Shop.style';

export type Props = {
	productTypes: Array<string>
};

export default class ProductTypeListing extends Component<Props> {
	render() {
		const { productTypes } = this.props;

		if (!productTypes) {
			return null;
		}

		return (
			<Sc.ProductTypeListing>
				{productTypes.map(p => this.renderProductType(p))}
			</Sc.ProductTypeListing>
		);
	}

	renderProductType(productType: string) {
		return (
			<li key={productType}>
				{productType === '' ? (
					<Link to="/stackend/test/shop">All</Link>
				) : (
					<Link to={'/stackend/test/shop/category/' + encodeURIComponent(productType)}>
						{productType}
					</Link>
				)}
			</li>
		);
	}
}
