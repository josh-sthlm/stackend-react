
import React, { Component } from 'react';
import { Link } from 'react-router';

import * as Sc from './Shop.style';

export type Props = {
	productTypes: Array<string>,
  productTypeUrlPattern: string
};

export default class ProductTypeListing extends Component<Props> {
	render() {
		const { productTypes } = this.props;

		if (!productTypes) {
			return null;
		}

		return (
			<Sc.ProductTypeListing>
				{productTypes.map(p =><li key={p}>${this.renderProductType(p)}</li>)}
			</Sc.ProductTypeListing>
		);
	}

	renderProductType(productType: string) {

	  const link = encodeURI(`${this.props.productTypeUrlPattern}`);

	  if (productType === '') {
      return <Link to="${link}">All</Link>;
    }

		return <Link to={link + encodeURIComponent(productType)}>
						{productType}
					</Link>;
	}
}
