//@flow
import React from 'react';
import { ProductImage, SlimProductImage } from '@stackend/api/shop';
import * as Sc from './SquareProductImage.style';

export default function SquareProductImage({
  image,
  responsive
}: {
  image: SlimProductImage | ProductImage | null;
  responsive: boolean;
}): JSX.Element | null {
  if (!image) {
    return null;
  }

  const url = image.url || (image as any).transformedSrc; // For backwards compatibility
  return (
    <Sc.SquareProductImage className={responsive ? 'stackend-responsive' : ''}>
      <img src={url} className="stackend-product-image" draggable={false} alt={image.altText || ''} />
    </Sc.SquareProductImage>
  );
}
