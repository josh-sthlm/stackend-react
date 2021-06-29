import React, { Component, MouseEvent } from 'react';
import * as Sc from './ProductImageBrowser.style';
import { Link } from 'react-router-dom';
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
    const { selectedImage } = this.props;
    return (
      <Sc.ProductImageBrowser>
        {selectedImage && (
          <Link to={selectedImage.originalSrc} target="_blank">
            {this.defaultRenderImage(selectedImage, false)}
          </Link>
        )}
        {this.renderProductImageThumbnails()}
      </Sc.ProductImageBrowser>
    );
  }

  defaultRenderImage = (image: ProductImage, isThumbnail: boolean): JSX.Element | null => {
    const { renderImage, product } = this.props;
    if (renderImage) {
      return renderImage(product, image, isThumbnail);
    }
    return <img src={image.transformedSrc} alt={image.altText || ''} draggable={false} />;
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
    const isSelected = selectedImage && selectedImage.originalSrc === image.originalSrc;

    return (
      <li key={image.transformedSrc} className={isSelected ? 'selected' : ''}>
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

  const x = product.variants.edges.find(v => {
    return v.node?.image?.transformedSrc === image.transformedSrc;
  });

  return x ? x.node : null;
}
