//@flow
import React, { Component } from 'react';
import * as Sc from './Shop.style';
import { MoneyV2 } from '@stackend/api/shop';
import { connect, ConnectedProps } from 'react-redux';
import { getCurrencyFormatter } from '@stackend/api/util';


const mapDispatchToProps = {};

function mapStateToProps(state: any) {
  let locale: string = (state?.communities?.community?.locale || 'en-US').replace('_', '-');
  return {
    locale
  };
}

const connector = connect(mapStateToProps, mapDispatchToProps);

interface Props extends ConnectedProps<typeof connector> {
  price: MoneyV2 | null;
}

/**
 * Render a price using the current community's locale
 */
class Price extends Component<Props> {
  render() {
    const { price, locale } = this.props;
    if (!price) {
      return null;
    }

    const formatter = getCurrencyFormatter(price.currencyCode, locale);

    return <Sc.Price>{formatter.format(parseFloat(price.amount))}</Sc.Price>;
  }
}

export default connector(Price);
