
import React, { Component } from 'react';
import { Link } from 'react-router';

import * as Sc from './Shop.style.js';
import { getFirstImage, Product as ProductType } from '@stackend/api/shop';
import type { GraphQLList, GraphQLListNode, Product, ProductImage } from '@stackend/api/shop';

export interface Props {
	products: GraphQLList<Product>
}

export default class ProductListing extends Component<Props> {
	render() {
		const { products } = this.props;

		if (!products) {
			return null;
		}

		return (
			<Sc.ProductListing>
				<Sc.Products>
					{products.edges.map((n: GraphQLListNode<Product>) => this.renderProduct(n.node))}
				</Sc.Products>

				{/* Room for pagination */}
			</Sc.ProductListing>
		);
	}

	renderProduct(product: ProductType) {
		let image: ProductImage = getFirstImage(product);

		return (
			<li key={product.id}>
				<Link to={'/stackend/test/shop/product/' + product.handle}>
					{image && <Sc.ProductListingImage src={image.transformedSrc} alt={image.altText} />}
					<Sc.Title>{product.title}</Sc.Title>
					<Sc.Price>[FIXME: Price]</Sc.Price>
					{/*<ProductLink product={product}/>*/}
					<Sc.ShopNow>SHOPPA NU</Sc.ShopNow>
				</Link>
			</li>
		);
	}
}
