import React, { Component } from 'react';
import * as Sc from './Shop.style.js';
import { getFirstImage, Product as IProduct } from '@stackend/api/shop';
import AddToBasketButton from './AddToBasketButton';
import { ProductImage } from '@stackend/api/shop';

export interface PropsType {
  product: IProduct;
}

/**
 * Renders a product
 */
export default class Product extends Component<PropsType> {
  render() {
    const { product } = this.props;

    if (!product) {
      return null;
    }

    // FIXME: Should show variant images
    let image = getFirstImage(product);

    return (
      <Sc.Product>
        <Sc.ProductImageBrowser>{image && this.renderImage(image)}</Sc.ProductImageBrowser>

        <h2>{product.title}</h2>
        <Sc.Price>[FIXME: Variant price]</Sc.Price>
        <div className="stackend-product-variants">FIXME: [VARIANTS]</div>

        <div className="stackend-product-tags">[FIXME: Tags]</div>

        <AddToBasketButton product={product} />

        <div className="stackend-product-description">{product.description}</div>
      </Sc.Product>
    );
  }

  renderImage = (image: ProductImage) => {
    return <img src={image.transformedSrc} key={image.id} alt={image.altText || ''} />;
  };
}
