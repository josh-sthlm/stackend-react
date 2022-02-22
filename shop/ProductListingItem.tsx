//@flow
import React, { MouseEventHandler } from 'react';
import { getFirstImage, SlimProduct } from '@stackend/api/shop';
import * as Sc from './ProductListingItem.style';
import { Link } from 'react-router-dom';
import SquareProductImage from './SquareProductImage';
import { ShopNowButton, Title } from './Shop.style';
import Price from './Price';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { ShopState } from '@stackend/api/shop/shopReducer';
import { connect, ConnectedProps } from 'react-redux';
import { getPriceIncludingVAT } from '@stackend/api/shop/vat';

function mapStateToProps(state: any): {
  shop: ShopState;
} {
  return {
    shop: state.shop
  };
}

const connector = connect(mapStateToProps);

const ProductListingItem = ({
  product,
  link,
  onClick,
  shop
}: {
  product: SlimProduct;
  link: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
} & WrappedComponentProps &
  ConnectedProps<typeof connector>): JSX.Element => {
  const image = getFirstImage(product);
  const price = getPriceIncludingVAT({ shopState: shop, product });
  return (
    <Sc.ProductListingItem key={product.id}>
      <Link to={link} onClick={onClick} className="stackend-product-link">
        <SquareProductImage image={image} responsive={true} />
        <Title>{product.title}</Title>
        <Price price={price} />
        <ShopNowButton>
          <FormattedMessage id="shop.buy_now" defaultMessage="BUY NOW!" />
        </ShopNowButton>
      </Link>
    </Sc.ProductListingItem>
  );
};

export default connector(injectIntl(ProductListingItem));
