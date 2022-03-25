//@flow

import React, { Component, Fragment } from 'react';
import { ShopState } from '@stackend/api/shop/shopReducer';
import {
  checkoutRemove,
  checkoutSetQuantity,
  requestMissingProducts,
  requestOrResetActiveCheckout,
  checkoutReplaceItems,
  getProductAndVariant
} from '@stackend/api/shop/shopActions';
import { getFirstImage, Checkout, CheckoutLineItem } from '@stackend/api/shop';
import { mapGraphQLList } from '@stackend/api/util/graphql';
import * as Sc from './Basket.style';
import { connect, ConnectedProps } from 'react-redux';
import { Link } from 'react-router-dom';
import NumberEntry from '../ui/NumberEntry';
import Price from './Price';
import { ButtonNext, ProductTitlePart, Title, VariantTitlePart } from './Shop.style';
import SquareProductImage from './SquareProductImage';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { getLinkFactory } from '../link/LinkFactory';
import ShopLinkFactory from './ShopLinkFactory';
import { Product } from '@stackend/api/src/shop';
import { getPriceIncludingVAT, getTotalPriceIncludingVAT } from '@stackend/api/shop/vat';
import CustomerCountrySelect from './CustomerCountrySelect';

function mapStateToProps(state: any): {
  shop: ShopState;
  products: { [handle: string]: Product };
  basketUpdated: number;
  checkout: Checkout | null;
} {
  const shop: ShopState = state.shop;
  return {
    shop: shop,
    products: shop.products,
    basketUpdated: shop.basketUpdated,
    checkout: shop.checkout
  };
}

const mapDispatchToProps = {
  checkoutRemove,
  checkoutSetQuantity,
  requestMissingProducts,
  requestOrResetActiveCheckout,
  checkoutReplaceItems
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export interface Props extends ConnectedProps<typeof connector>, WrappedComponentProps {
  /**
   * Image width
   */
  imageMaxWidth?: number;

  /**
   * Show placeholder basket items while loading
   */
  showPlaceholder?: boolean;

  /**
   * Function invoked when checkout is clicked
   * @param basket
   */
  onCheckoutClicked: (checkout: Checkout) => void;
}

type State = {
  loading: boolean;
  expectedLength: number;
};

class Basket extends Component<Props, State> {
  static defaultProps = {
    showPlaceholder: true
  };

  state = {
    loading: true,
    expectedLength: 4
  };

  async componentDidMount(): Promise<void> {
    const { imageMaxWidth, checkout } = this.props;

    if (!checkout || checkout.completedAt !== null) {
      await this.props.requestOrResetActiveCheckout({ imageMaxWidth });
    }
    this.setState({ loading: false });
  }

  render(): JSX.Element {
    const { checkout, shop } = this.props;
    const { loading } = this.state;
    const linkFactory = getLinkFactory<ShopLinkFactory>('shop');

    let totalPrice = null;
    if (checkout !== null) {
      totalPrice = getTotalPriceIncludingVAT({ shopState: shop, checkout });
    }

    return (
      <Sc.Basket>
        {loading ? (
          this.renderPlaceholder()
        ) : checkout && checkout.lineItems.edges.length !== 0 ? (
          <Fragment>
            <Sc.BasketList>
              {mapGraphQLList(checkout.lineItems, (i: CheckoutLineItem) => this.renderBasketItem(i, linkFactory))}
            </Sc.BasketList>
            <Sc.BasketActions>
              <Sc.BasketLine>
                <CustomerCountrySelect />
                <Sc.BasketTotalPrice className="stackend-basket-total">
                  <span className="stackend-basket-total-label">
                    <FormattedMessage id="shop.total" defaultMessage="Total" />:
                  </span>{' '}
                  <Price price={totalPrice /*checkout.subtotalPriceV2*/} />
                </Sc.BasketTotalPrice>
              </Sc.BasketLine>
              <ButtonNext onClick={this.onCheckoutClicked}>
                <FormattedMessage id="shop.checkout" defaultMessage="Checkout" />
              </ButtonNext>
            </Sc.BasketActions>
          </Fragment>
        ) : (
          <Sc.BasketEmpty>
            <FormattedMessage id="shop.basket.basket_is_empty" defaultMessage="The basket is empty" />
          </Sc.BasketEmpty>
        )}
      </Sc.Basket>
    );
  }

  renderBasketItem = (i: CheckoutLineItem, linkFactory: ShopLinkFactory): JSX.Element | null => {
    const handle = i.variant.product.handle;
    const variantId = i.variant.id;
    const { shop } = this.props;

    const pv = getProductAndVariant(shop, i);
    if (!pv) {
      return null;
    }
    const v = pv.variant;
    const p = pv.product;

    const price = getPriceIncludingVAT({
      shopState: shop,
      product: pv.product,
      productVariant: pv.variant,
      quantity: i.quantity
    });
    const image = v.image || getFirstImage(p);
    const hasSingleVariant = p.options.length === 1 && p.options[0].values.length === 1;
    const link = linkFactory.createProductLink(p, v);

    return (
      <Sc.BasketItem key={handle + '-' + (variantId || 'default')}>
        <Link to={link} className="stackend-product-image-link">
          <SquareProductImage image={image} responsive={true} />
        </Link>
        <Link to={link} className="stackend-product-title">
          <Title>
            <ProductTitlePart>{p.title}</ProductTitlePart>{' '}
            {!hasSingleVariant && <VariantTitlePart>{v.title}</VariantTitlePart>}
          </Title>
        </Link>
        <NumberEntry
          value={i.quantity}
          onChange={(value): void => this.onQuantityChanged(value, i)}
          max={100}
          min={1}
        />
        <Price price={price} />
        <button onClick={(): void => this.onRemoveClicked(i)} className="stackend-remove-product stackend-icon">
          <i className="material-icons">delete</i>
        </button>
      </Sc.BasketItem>
    );
  };

  onQuantityChanged = (q: number, i: CheckoutLineItem): void => {
    const { checkout } = this.props;
    if (!checkout) {
      return;
    }

    this.props.checkoutSetQuantity(i.variant.id, q);
  };

  onRemoveClicked = (i: CheckoutLineItem): void => {
    const { checkout } = this.props;
    if (!checkout) {
      return;
    }

    const pv = getProductAndVariant(this.props.shop, i);
    if (pv) {
      this.props.checkoutRemove(pv.product, pv.variant, i.quantity);
    }
  };

  onCheckoutClicked = async (): Promise<void> => {
    const { checkout } = this.props;
    if (checkout && this.props.onCheckoutClicked) {
      this.props.onCheckoutClicked(checkout);
    }
  };

  renderPlaceholder = (): JSX.Element | null => {
    const { expectedLength } = this.state;
    const { showPlaceholder } = this.props;
    if (!showPlaceholder) {
      return null;
    }

    const n = Math.max(1, expectedLength);
    const c = [];
    for (let i = 0; i < n; i++) {
      c.push(<Sc.BasketItem key={i} className="stackend-basket-item-placeholder" />);
    }
    return <Sc.BasketList>{c}</Sc.BasketList>;
  };
}

export default injectIntl(connector(Basket));
