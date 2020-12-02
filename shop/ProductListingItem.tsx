//@flow
import React from 'react';
import { getFirstImage, SlimProduct } from '@stackend/api/shop';
import * as Sc from './ProductListingItem.style';
import { Link } from 'react-router';
import SquareProductImage from './SquareProductImage';
import { ShopNowButton, Title } from './Shop.style';
import Price from './Price';
import { injectIntl } from 'react-intl';

function ProductListingItem({ product, link }: { product: SlimProduct; link: string }) {
  const image = getFirstImage(product);
  return (
    <Sc.ProductListingItem key={product.id}>
      <Link to={link}>
        <SquareProductImage image={image} responsive={true} />
        <Title>{product.title}</Title>
        <Price price={product.priceRange.minVariantPrice} />
        <ShopNowButton>SHOPPA NU</ShopNowButton>
      </Link>
    </Sc.ProductListingItem>
  );
}

export default injectIntl(ProductListingItem);
