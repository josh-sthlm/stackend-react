//@flow
import React, { MouseEventHandler } from 'react';
import { getFirstImage, SlimProduct } from '@stackend/api/shop';
import * as Sc from './ProductListingItem.style';
import { Link } from 'react-router-dom';
import SquareProductImage from './SquareProductImage';
import { ShopNowButton, Title } from './Shop.style';
import Price from './Price';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';

const ProductListingItem = ({
  product,
  link,
  onClick
}: {
  product: SlimProduct;
  link: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
} & WrappedComponentProps): JSX.Element => {
  const image = getFirstImage(product);
  return (
    <Sc.ProductListingItem key={product.id}>
      <Link to={link} onClick={onClick}>
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
