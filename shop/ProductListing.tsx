import React, { Component } from 'react';
import { Link } from 'react-router';

import * as Sc from './Shop.style.js';
import { getFirstImage, Product as ProductType } from '@stackend/api/shop';
import type { GraphQLList, GraphQLListNode, Product } from '@stackend/api/shop';

export interface Props {
  products: GraphQLList<Product>;
  productUrlPattern: string;
}

export default class ProductListing extends Component<Props> {
  render(): JSX.Element | null {
    const { products } = this.props;

    if (!products) {
      return null;
    }

    return (
      <Sc.ProductListing>
        <Sc.Products>{products.edges.map((n: GraphQLListNode<Product>) => this.renderProduct(n.node))}</Sc.Products>

        {/* Room for pagination */}
      </Sc.ProductListing>
    );
  }

  renderProduct(product: ProductType): JSX.Element | null {
    const image = getFirstImage(product);

    const link = encodeURI(`${this.props.productUrlPattern}`);

    return (
      <li key={product.id}>
        <Link to={link}>
          {image && <Sc.ProductListingImage src={image.transformedSrc} alt={image.altText || ''} />}
          <Sc.Title>{product.title}</Sc.Title>
          <Sc.Price>[FIXME: Price]</Sc.Price>
          {/*<ProductLink product={product}/>*/}
          <Sc.ShopNow>SHOPPA NU</Sc.ShopNow>
        </Link>
      </li>
    );
  }
}
