//@flow
import React, { Component } from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';

import { ShopState } from '@stackend/api/shop/shopReducer';
import { connect, ConnectedProps } from 'react-redux';
import { VatCountry, listCountries, setCustomerCountryCode, getCustomerInfo } from '@stackend/api/shop/vat';
import { CommunityState } from '@stackend/api/stackend/communityReducer';
import { Community } from '@stackend/api/stackend';
import { getCountryCode } from '@stackend/api/util/getCountryCode';

function mapState(state: any): { shop: ShopState; community: Community | null | undefined } {
  const shop: ShopState = state.shop;
  const communities: CommunityState = state.communities;
  return {
    shop,
    community: communities.community
  };
}

const mapDispatch = {
  listCountries,
  setCustomerCountryCode,
  getCustomerInfo
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
    const { customerCountryCode, intl, getCustomerInfo, community } = this.props;

    const ci = getCustomerInfo();
    let ccc = customerCountryCode || ci?.customerCountryCode;
    if (!ccc && community) {
      ccc = getCountryCode(community.locale) || '';
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
    const { listCountries } = this.props;
    const r = await listCountries();
    if (!r.error) {
      this.setState({
        countries: r.countries
      });
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

    // fu-tslint
    return (countries as any).map((c: VatCountry) => (
      <option key={c.countryCode} value={c.countryCode}>
        {c.name}
      </option>
    ));
  };

  onChange = (e: any): void => {
    const { onCustomerCountryChanged, setCustomerCountryCode } = this.props;
    const customerCountryCode = e.target.value;
    if (customerCountryCode) {
      if (onCustomerCountryChanged) {
        onCustomerCountryChanged(customerCountryCode);
      }

      setCustomerCountryCode(customerCountryCode);
    }
  };
}

export default connector(injectIntl(CustomerCountrySelect));
