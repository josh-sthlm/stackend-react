import React, { Component, MouseEvent } from 'react';
import * as Sc from './ProductImageBrowser.style';

import {
  getAllUniqueImages,
  ProductImage,
  Product,
  getProductSelection,
  ProductSelection,
  ProductVariant
} from '@stackend/api/shop';

type Props = {
  /**
   * Product
   */
  product: Product;

  /**
   * Selected image
   */
  selectedImage: ProductImage | null;

  /**
   * Optional function to render an image
   * @param product
   * @param image
   * @param isThumbnail
   */
  renderImage?: (product: Product, image: ProductImage, isThumbnail: boolean) => JSX.Element | null;

  /**
   * An image has been selected
   * @param product
   * @param image
   * @param productVariant
   * @param selection May be null
   */
  onImageSelected: (
    product: Product,
    image: ProductImage,
    productVariant: ProductVariant | null,
    selection: ProductSelection | null
  ) => void;
};

export default class ProductImageBrowser extends Component<Props> {
  render(): JSX.Element {
    return (
      <Sc.ProductImageBrowser>
        {this.renderSelectedImage()}
        {this.renderProductImageThumbnails()}
      </Sc.ProductImageBrowser>
    );
  }

  renderSelectedImage(): JSX.Element | null {
    const { selectedImage } = this.props;
    if (!selectedImage) {
      return null;
    }
    const url = selectedImage.url__originalSrc || (selectedImage as any).originalSrc; // For backwards compatibility
    return (
      <a href={url} target="_blank" rel="noreferrer">
        {this.defaultRenderImage(selectedImage, false)}
      </a>
    );
  }

  defaultRenderImage = (image: ProductImage, isThumbnail: boolean): JSX.Element | null => {
    const { renderImage, product } = this.props;
    if (renderImage) {
      return renderImage(product, image, isThumbnail);
    }
    const url = image.url || (image as any).transformedSrc; // For backwards compatibility
    return <img src={url} alt={image.altText || ''} draggable={false} />;
  };

  renderProductImageThumbnails = (): JSX.Element | null => {
    const { product } = this.props;
    const images: Array<ProductImage> = getAllUniqueImages(product);
    return images.length > 1 ? (
      <Sc.ProductImageBrowserThumbnails>{images.map(this.renderThumbnail)}</Sc.ProductImageBrowserThumbnails>
    ) : null;
  };

  renderThumbnail = (image: ProductImage): JSX.Element | null => {
    const { selectedImage } = this.props;
    const url = image.url || (image as any).transformedSrc; // For backwards compatibility
    const isSelected = selectedImage && (selectedImage.url || (selectedImage as any).transformedSrc) === url;

    return (
      <li key={url} className={isSelected ? 'selected' : ''}>
        <button onClick={(e): void => this.onThumbnailClicked(e, image)}>{this.defaultRenderImage(image, true)}</button>
      </li>
    );
  };

  onThumbnailClicked = (e: MouseEvent, image: ProductImage): void => {
    const { product } = this.props;
    const productVariant = findProductVariantByImage(product, image);
    let selection: ProductSelection | null = null;
    if (productVariant) {
      selection = getProductSelection(product, productVariant);
    }

    this.props.onImageSelected(product, image, productVariant, selection);
  };
}

/**
 * Find a product variant given an image
 * @param product
 * @param image
 */
export function findProductVariantByImage(product: Product, image: ProductImage): ProductVariant | null {
  if (!product || !image) {
    return null;
  }

  const url = image.url || (image as any).transformedSrc; // For backwards compatibility

  const x = product.variants.edges.find(v => {
    const i = v.node?.image;

    if (!i) {
      return false;
    }
    const u = i.url || (i as any).transformedSrc; // For backwards compatibility
    return u === url;
  });

  return x ? x.node : null;
}
