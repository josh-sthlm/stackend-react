//@flow
import React, { Component } from 'react';
import * as Sc from './Shop.style';
import { MoneyV2 } from '@stackend/api/shop';
import { connect, ConnectedProps } from 'react-redux';
import { getCurrencyFormatter } from '@stackend/api/util';
import { requestCurrencyInfo, roundToMinimalFractionalUnit } from '@stackend/api/shop/currency';
import { ShopState } from '@stackend/api/shop/shopReducer';

export enum Type {
  REDUCED = 'reduced',
  ORIGINAL = 'original'
}

function mapState(state: any): {
  locale: string;
  shop: ShopState;
} {
  const locale: string = (state?.communities?.community?.locale || 'en-US').replace('_', '-');
  return {
    locale,
    shop: state?.shop
  };
}

const mapDispatch = {
  requestCurrencyInfo
};

const connector = connect(mapState, mapDispatch);

export interface Props extends ConnectedProps<typeof connector> {
  price: MoneyV2 | null | undefined;
  type?: Type;
}

/**
 * Render a price using the current community's locale
 */
class Price extends Component<Props> {
  componentDidMount(): void {
    const { requestCurrencyInfo, price } = this.props;
    if (price) {
      requestCurrencyInfo(price.currencyCode);
    }
  }

  render(): JSX.Element | null {
    const { price, locale, shop, type } = this.props;
    if (!price) {
      return null;
    }

    let className = '';
    switch (type) {
      case Type.REDUCED:
        className = 'stackend-product-price-reduced';
        break;
      case Type.ORIGINAL:
        className = 'stackend-product-price-orig';
        break;
    }

    // To match Shopify
    const p = roundToMinimalFractionalUnit(shop, price);

    const formatter = getCurrencyFormatter(price.currencyCode, locale);

    return <Sc.Price className={className}>{formatter.format(parseFloat(p.amount))}</Sc.Price>;
  }
}

export default connector(Price);
