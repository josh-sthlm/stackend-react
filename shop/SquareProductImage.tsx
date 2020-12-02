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
  return image ? (
    <Sc.SquareProductImage className={responsive ? 'stackend-responsive' : ''}>
      <img src={image.transformedSrc} className="stackend-product-image" draggable={false} />
    </Sc.SquareProductImage>
  ) : null;
}
