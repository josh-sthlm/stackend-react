//@flow
import React, { Component } from 'react';
import * as Sc from './Shop.style';
import { MoneyV2 } from '@stackend/api/shop';
import { connect } from 'react-redux';
import { getCurrencyFormatter } from '@stackend/api/util';

export type Props = {
  price: MoneyV2;
};

const mapDispatchToProps = {};

function mapStateToProps(state: any, ownProps: any) {
  let locale: string = (state?.communities?.community?.locale || 'en-US').replace('_', '-');
  return {
    locale
  };
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

export default connect(mapStateToProps, mapDispatchToProps)(Price);
