//@flow
import React, { Component } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';

import { ShopState } from '@stackend/api/shop/shopReducer';
import { connect, ConnectedProps } from 'react-redux';
import { VatCountry, listCountries } from '@stackend/api/shop/vat';

function mapState(state: any): {} {
  const shop: ShopState = state.shop;
  return {
    shop
  };
}

const connector = connect(mapState, {
  listCountries
});

type State = {
  countries: Array<VatCountry> | null;
};

type Props = {
  customerCountryCode: string;

  /**
   * Callback invoked when the selection is changed
   */
  onCustomerCountryChanged: (customerCountryCode: string) => void;
} & WrappedComponentProps &
  React.SelectHTMLAttributes<HTMLSelectElement> &
  ConnectedProps<typeof connector>;

/**
 * Given a product, render a UI that allows the user to pick a specific product variant.
 */
class CustomerCountrySelect extends Component<Props, State> {
  state = {
    countries: null
  };
  render(): JSX.Element | null {
    const { customerCountryCode } = this.props;
    return (
      <select
        className="stackend-customer-country-select"
        size={1}
        value={customerCountryCode || ''}
        onChange={this.onChange}>
        {this.renderCountries}
      </select>
    );
  }

  async componentDidMount() {
    const r = await this.props.listCountries();
    if (!r.error) {
      this.setState({
        countries: r.countries
      });
    }
  }

  renderCountries = () => {
    const { countries } = this.state;
    if (!countries) {
      return <option disabled={true}>Loading...</option>;
    }

    // fu-tslint
    return (countries as any).map((c: VatCountry) => (
      <option key={c.countryCode} value={c.countryCode}>
        {c.name}
      </option>
    ));
  };

  onChange = (e: any): void => {
    const { onCustomerCountryChanged } = this.props;

    if (onCustomerCountryChanged) {
      onCustomerCountryChanged(e.target.value);
    }
  };
}

export default connector(injectIntl(CustomerCountrySelect));
