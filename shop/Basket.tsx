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
import {
  MoneyV2,
  getFirstImage,
  Checkout,
  CheckoutLineItem,
  toMoneyV2,
  Product as IProduct,
  ProductVariant
} from '@stackend/api/shop';
import { mapGraphQLList } from '@stackend/api/util/graphql';
import * as Sc from './Basket.style';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import NumberEntry from '../ui/NumberEntry';
import Price from './Price';
import { ButtonNext, ProductTitlePart, Title, VariantTitlePart } from './Shop.style';
import SquareProductImage from './SquareProductImage';
import { FormattedMessage, injectIntl } from 'react-intl';

function mapStateToProps(state: any, ownProps: any) {
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

export type Props = {
  /**
   * Function invoked to create links to products
   * @param product
   * @param productVariant
   */
  createProductLink: (product: IProduct, productVariant?: ProductVariant) => string;

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
};

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

  async componentDidMount() {
    const { imageMaxWidth } = this.props;
    let checkout: Checkout = this.props.checkout;

    if (!checkout || checkout.completedAt !== null) {
      await this.props.requestOrResetActiveCheckout({ imageMaxWidth });
    }
    this.setState({ loading: false });
  }

  render() {
    const checkout: Checkout = this.props.checkout;
    const { loading } = this.state;

    return (
      <Sc.Basket>
        {loading ? (
          this.renderPlaceholder()
        ) : checkout && checkout.lineItems.edges.length !== 0 ? (
          <Fragment>
            <Sc.BasketList>{mapGraphQLList(checkout.lineItems, this.renderBasketItem)}</Sc.BasketList>
            <Sc.BasketActions>
              <Sc.BasketTotalPrice className="stackend-basket-total">
                <span className="stackend-basket-total-label">
                  <FormattedMessage id="shop.total" defaultMessage="Total" />:
                </span>{' '}
                <Price price={checkout.subtotalPriceV2} />
              </Sc.BasketTotalPrice>
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

  renderBasketItem = (i: CheckoutLineItem) => {
    const handle = i.variant.product.handle;
    const variantId = i.variant.id;

    const pv = getProductAndVariant(this.props.shop, i);
    if (!pv) {
      return null;
    }
    const v = pv.variant;
    const p = pv.product;

    const price: MoneyV2 = toMoneyV2(parseFloat(v.priceV2.amount) * i.quantity, v.priceV2.currencyCode);
    const image = v.image || getFirstImage(p);
    const hasSingleVariant = p.options.length === 1 && p.options[0].values.length === 1;
    const link = this.props.createProductLink(p, v);

    return (
      <Sc.BasketItem key={handle + '-' + (variantId || 'default')}>
        <Link to={link} className="stackend-product-image">
          <SquareProductImage image={image} responsive={true} />
        </Link>
        <Link to={link} className="stackend-product-title">
          <Title>
            <ProductTitlePart>{p.title}</ProductTitlePart>{' '}
            {!hasSingleVariant && <VariantTitlePart>{v.title}</VariantTitlePart>}
          </Title>
        </Link>
        <NumberEntry value={i.quantity} onChange={value => this.onQuantityChanged(value, i)} max={100} min={1} />
        <Price price={price} />
        <button onClick={() => this.onRemoveClicked(i)} className="stackend-remove-product stackend-is-icon">
          <i className="material-icons">delete</i>
        </button>
      </Sc.BasketItem>
    );
  };

  onQuantityChanged = (q: number, i: CheckoutLineItem) => {
    const checkout: Checkout = this.props.checkout;
    if (!checkout) {
      return;
    }

    this.props.checkoutSetQuantity(i.variant.id, q);
  };

  onRemoveClicked = (i: CheckoutLineItem) => {
    const checkout: Checkout = this.props.checkout;
    if (!checkout) {
      return;
    }

    let pv = getProductAndVariant(this.props.shop, i);
    if (pv) {
      this.props.checkoutRemove(pv.product, pv.variant, i.quantity);
    }
  };

  onCheckoutClicked = async () => {
    const checkout: Checkout = this.props.checkout;
    if (this.props.onCheckoutClicked) {
      this.props.onCheckoutClicked(checkout);
    }
  };

  renderPlaceholder = () => {
    const { expectedLength } = this.state;
    const { showPlaceholder } = this.props;
    if (!showPlaceholder) {
      return null;
    }

    const n = Math.max(1, expectedLength);
    let c = [];
    for (let i = 0; i < n; i++) {
      c.push(<Sc.BasketItem key={i} className="stackend-basket-item-placeholder" />);
    }
    return <Sc.BasketList>{c}</Sc.BasketList>;
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Basket));