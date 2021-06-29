//@flow

import React, { ChangeEvent, Component, MouseEvent } from 'react';
import { ShopState } from '@stackend/api/shop/shopReducer';
import { getProductAndVariant, selectShipping } from '@stackend/api/shop/shopActions';
import {
  Checkout,
  CheckoutLineItem,
  CheckoutResult,
  GetCheckoutResult,
  MoneyV2,
  ShippingRate,
  toMoneyV2
} from '@stackend/api/shop';
import { mapGraphQLList } from '@stackend/api/util/graphql';
import * as Sc from './ShippingOptionsForm.style';
import { connect, ConnectedProps } from 'react-redux';
import { ButtonBox, ButtonNext, ButtonPrevious, Quantity, Title } from '../Shop.style';
import Price from '../Price';
import { getJsonErrorText } from '@stackend/api/api';
import { requestOrResetActiveCheckout } from '@stackend/api/shop/shopActions';
import { FormattedMessage, injectIntl } from 'react-intl';

function mapStateToProps(state: any, _ownProps: any) {
  const shop: ShopState = state.shop;
  return {
    checkout: shop.checkout,
    community: state.communities.community,
    shop
  };
}

const mapDispatchToProps = {
  selectShipping,
  requestOrResetActiveCheckout
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export interface Props extends ConnectedProps<typeof connector> {
  imageMaxWidth?: number;
  onCancelClicked: () => void;
  onBackClicked?: () => void;
  onContinueClicked?: (checkoutResult: CheckoutResult) => void;
}

type State = {
  shippingHandle: string;
  valid: boolean;
  submitted: boolean;
  loadingCheckout: boolean;
};

class ShippingOptionsForm extends Component<Props, State> {
  static defaultProps = {
    onContinueClicked: (checkoutResult: CheckoutResult): void => {
      window.location = checkoutResult.checkout.webUrl;
    }
  };

  state = {
    shippingHandle: '',
    valid: false,
    submitted: false,
    loadingCheckout: true
  };

  async componentDidMount(): Promise<void> {
    let checkout: Checkout | null = this.props.checkout;
    const imageMaxWidth = this.props.imageMaxWidth;

    // Ensure a valid checkout exists
    if (!checkout) {
      const r: GetCheckoutResult = await this.props.requestOrResetActiveCheckout({ imageMaxWidth });
      if (!r.error) {
        checkout = r.checkout;
      }
    }

    // Go back to basket if no checkout exists
    if (!checkout || checkout.completedAt !== null) {
      this.props.onCancelClicked();
      return;
    }

    if (checkout) {
      let shippingHandle = '';
      if (checkout.shippingLine) {
        shippingHandle = checkout.shippingLine.handle;
      } else if (checkout.availableShippingRates && checkout.availableShippingRates.shippingRates.length !== 0) {
        shippingHandle = checkout.availableShippingRates.shippingRates[0].handle;
      }

      this.setState({
        shippingHandle,
        valid: true,
        loadingCheckout: false
      });
    }
  }

  render(): JSX.Element | null {
    const { valid, submitted, shippingHandle, loadingCheckout } = this.state;
    const { checkout } = this.props;

    if (loadingCheckout) {
      return (
        <Sc.ShippingOptionsForm>
          <p>
            <FormattedMessage id="shop.shipping.please_wait" defaultMessage="Please wait..." />
          </p>
        </Sc.ShippingOptionsForm>
      );
    }

    if (submitted) {
      return (
        <Sc.ShippingOptionsForm>
          <p>
            <FormattedMessage
              id="shop.payment.directing_to_shopify"
              defaultMessage="You will be shortly be directed to Shopify for payment..."
            />
          </p>
        </Sc.ShippingOptionsForm>
      );
    }

    if (!checkout || !checkout.availableShippingRates) {
      return (
        <Sc.ShippingOptionsForm>
          <ButtonPrevious onClick={this.props.onCancelClicked}>
            <FormattedMessage
              id="shop.shipping.can_not_ship"
              defaultMessage="Your items can not be shipped. Return to the basket"
            />
          </ButtonPrevious>
        </Sc.ShippingOptionsForm>
      );
    }

    let totalPrice: MoneyV2 = {
      amount: checkout.subtotalPriceV2.amount,
      currencyCode: checkout.subtotalPriceV2.currencyCode
    };

    const selectedRate: ShippingRate | undefined = checkout.availableShippingRates.shippingRates.find(
      (r: ShippingRate) => r.handle === shippingHandle
    );

    if (selectedRate) {
      const v = parseFloat(totalPrice.amount) + parseFloat(selectedRate.priceV2.amount);
      totalPrice = toMoneyV2(v, totalPrice.currencyCode);
    }

    return (
      <Sc.ShippingOptionsForm>
        <Sc.Fields>
          <Sc.ProductList>{mapGraphQLList(checkout.lineItems, this.renderLineItem)}</Sc.ProductList>
        </Sc.Fields>

        <Sc.Fields>
          {checkout.availableShippingRates.shippingRates.map((r: ShippingRate) => (
            <Sc.ShippingOption key={r.handle}>
              <input
                id={r.handle}
                type="radio"
                name="shippingRate"
                value={r.handle}
                onChange={this.onShippingChanged}
                checked={r.handle === shippingHandle}
              />
              <label htmlFor={r.handle}>
                <span>{r.title}</span>
                <Price price={r.priceV2} />
              </label>
            </Sc.ShippingOption>
          ))}
        </Sc.Fields>

        <Sc.Fields>
          <Sc.TotalPrice>
            <Sc.TotalPriceLabel>
              <FormattedMessage id="shop.total_price" defaultMessage="Total" />:
            </Sc.TotalPriceLabel>{' '}
            <Price price={totalPrice} />
          </Sc.TotalPrice>
        </Sc.Fields>

        <ButtonBox>
          <ButtonPrevious type="button" onClick={this.props.onBackClicked}>
            <FormattedMessage id="shop.back" defaultMessage="Back" />
          </ButtonPrevious>
          <ButtonNext type="submit" onClick={this.onContinueClicked} disabled={!valid || submitted}>
            <FormattedMessage id="shop.payment" defaultMessage="Payment" />
          </ButtonNext>
        </ButtonBox>
      </Sc.ShippingOptionsForm>
    );
  }

  renderLineItem = (i: CheckoutLineItem): JSX.Element | null => {
    const pv = getProductAndVariant(this.props.shop, i);
    if (pv == null) {
      return null;
    }
    const price: MoneyV2 = toMoneyV2(
      parseFloat(pv.variant.priceV2.amount) * i.quantity,
      pv.variant.priceV2.currencyCode
    );
    return (
      <Sc.Product key={i.variant.id}>
        <Quantity>{i.quantity}</Quantity>
        <Title>{i.title}</Title>
        <Price price={price} />
      </Sc.Product>
    );
  };

  onShippingChanged = (e: ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      shippingHandle: e.target.value,
      valid: true
    });
  };

  onContinueClicked = async (e: MouseEvent): Promise<void> => {
    e.stopPropagation();
    e.preventDefault();
    const { checkout } = this.props;
    const { valid, shippingHandle } = this.state;
    if (!checkout || !valid) {
      return;
    }

    this.setState({
      submitted: true
    });

    const r: CheckoutResult = await this.props.selectShipping({
      checkoutId: checkout.id,
      shippingRateHandle: shippingHandle
    });

    if (r.error) {
      // FIXME: Improve error
      alert(getJsonErrorText(r));
      return;
    }

    if (r.response.checkoutUserErrors.length !== 0) {
      alert(r.response.checkoutUserErrors.map(e => e.message + ' '));
      return;
    }

    if (this.props.onContinueClicked) {
      this.props.onContinueClicked(r);
    }
  };
}

export default injectIntl(connector(ShippingOptionsForm));
