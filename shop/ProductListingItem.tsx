//@flow
import React from 'react';
import { getFirstImage, SlimProduct } from '@stackend/api/shop';
import * as Sc from './ProductListingItem.style';
import { Link } from 'react-router';
import SquareProductImage from './SquareProductImage';
import { ShopNowButton, Title } from './Shop.style';
import Price from './Price';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';

const ProductListingItem = ({
  product,
  link
}: { product: SlimProduct; link: string } & WrappedComponentProps): JSX.Element => {
  const image = getFirstImage(product);
  return (
    <Sc.ProductListingItem key={product.id}>
      <Link to={link}>
        <SquareProductImage image={image} responsive={true} />
        <Title>{product.title}</Title>
        <Price price={product.priceRange.minVariantPrice} />
        <ShopNowButton>
          <FormattedMessage id="shop.buy_now" defaultMessage="BUY NOW!" />
        </ShopNowButton>
      </Link>
    </Sc.ProductListingItem>
  );
};

export default injectIntl(ProductListingItem);
