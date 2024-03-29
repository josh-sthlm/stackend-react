//@flow
import React, { Component } from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';

import { ShopState } from '@stackend/api/shop/shopReducer';
import { connect, ConnectedProps } from 'react-redux';
import { VatCountry, listCountries, setCustomerCountryCode, getCustomerInfo } from '@stackend/api/shop/vat';
import { cartBuyerIdentityUpdate, getCart } from '@stackend/api/shop/shopActions';

function mapState(state: any): { shop: ShopState } {
  const shop: ShopState = state.shop;
  return {
    shop
  };
}

const mapDispatch = {
  listCountries,
  setCustomerCountryCode,
  cartBuyerIdentityUpdate,
  getCustomerInfo,
  getCart
};
const connector = connect(mapState, mapDispatch);

type State = {
  countries: Array<VatCountry> | null;
};

type Props = WrappedComponentProps &
  ConnectedProps<typeof connector> &
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    customerCountryCode?: string;

    /**
     * Callback invoked when the selection is changed
     */
    onCustomerCountryChanged?: (customerCountryCode: string) => void;
  };

/**
 * Select that sets the customers country of origin for vats etc.
 */
class CustomerCountrySelect extends Component<Props, State> {
  state = {
    countries: null
  };
  render(): JSX.Element | null {
    const { customerCountryCode, intl, getCustomerInfo, shop } = this.props;

    const ci = getCustomerInfo();
    let ccc = customerCountryCode || ci?.customerCountryCode;
    if (!ccc && shop.vats) {
      ccc = shop.vats.shopCountryCode || '';
    }
    return (
      <select
        className="stackend-customer-country-select"
        size={1}
        value={ccc}
        onChange={this.onChange}
        title={intl.formatMessage({ id: 'shop.select_your_country', defaultMessage: 'Select your country' })}>
        {this.renderCountries()}
      </select>
    );
  }

  async componentDidMount(): Promise<void> {
    const { listCountries, shop } = this.props;
    const r = await listCountries();
    if (!r.error) {
      this.setState({
        countries: r.countries
      });
    }

    // FIXME: Good idea?
    if (shop.vats && !shop.vats.customerCountryCode) {
      setCustomerCountryCode(shop.vats.shopCountryCode);
    }
  }

  renderCountries = (): JSX.Element | null => {
    const { countries } = this.state;
    if (!countries) {
      return (
        <option disabled={true}>
          <FormattedMessage id="shop.shipping.please_wait" defaultMessage="Please wait..." />
        </option>
      );
    }

    return (countries as any).map((c: VatCountry) => (
      <option key={c.countryCode} value={c.countryCode}>
        {c.name}
      </option>
    ));
  };

  onChange = async (e: any): Promise<void> => {
    const { onCustomerCountryChanged, setCustomerCountryCode, getCart, cartBuyerIdentityUpdate } = this.props;
    const customerCountryCode = e.target.value;
    if (customerCountryCode) {
      if (onCustomerCountryChanged) {
        onCustomerCountryChanged(customerCountryCode);
      }

      setCustomerCountryCode(customerCountryCode);

      const cart = await getCart({});
      if (cart) {
        await cartBuyerIdentityUpdate({
          ...cart.buyerIdentity,
          countryCode: customerCountryCode
        });
      }
    }
  };
}

export default connector(injectIntl(CustomerCountrySelect));
