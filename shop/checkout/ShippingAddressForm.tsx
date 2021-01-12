//@flow

import React, { ChangeEvent, MouseEvent, Component } from 'react';
import { ShopState } from '@stackend/api/shop/shopReducer';
import {
  requestMissingProducts,
  requestAddressFields,
  requestCountries,
  updateShippingAddress,
  requestOrResetActiveCheckout,
  checkoutSetEmail
} from '@stackend/api/shop/shopActions';
import {
  CheckoutResult,
  ShippingAddress,
  getCountry,
  Checkout,
  GetCheckoutResult,
  Country,
  AddressFieldName
} from '@stackend/api/shop';
import * as Sc from './ShippingAddressForm.style';
import { connect, ConnectedProps } from 'react-redux';
import { ButtonBox, ButtonNext, ButtonPrevious } from '../Shop.style';
import { Community } from '@stackend/api/stackend';
import { getStackendLocale, EMAIL_VALIDATION_REGEXP_RELAXED } from '@stackend/api/util';
import { getJsonErrorText } from '@stackend/api/api';
import { FormattedMessage, injectIntl } from 'react-intl';

function mapStateToProps(state: any, ownProps: any): any {
  const shop: ShopState = state.shop;
  const community: Community = state?.communities?.community;

  return {
    shop: shop,
    products: shop.products,
    basketUpdated: shop.basketUpdated,
    countryCodes: shop.countryCodes,
    countriesByCode: shop.countriesByCode,
    addressFieldsByCountryCode: shop.addressFieldsByCountryCode,
    checkout: shop.checkout,
    community
  };
}

const mapDispatchToProps = {
  requestMissingProducts,
  requestCountries,
  requestAddressFields,
  getCountry,
  updateShippingAddress,
  requestOrResetActiveCheckout,
  checkoutSetEmail
};

const connector = connect(mapStateToProps, mapDispatchToProps);

interface Props extends ConnectedProps<typeof connector> {
  imageMaxWidth?: number;
  onBackClicked: () => void;
  onContinueClicked: (checkout: Checkout) => void;
}

type Field = {
  autoComplete: string;
  minLength: number;
  required: boolean;
};
const FIELDS: { [name: string]: Field } = {
  firstName: { autoComplete: 'given-name', minLength: 2, required: true },
  lastName: { autoComplete: 'family-name', minLength: 2, required: true },
  phone: { autoComplete: 'tel', minLength: 0, required: false },
  company: { autoComplete: 'organization', minLength: 2, required: false },
  address1: { autoComplete: 'street-address', minLength: 2, required: true },
  address2: { autoComplete: 'street-address', minLength: 2, required: false },
  zip: { autoComplete: 'postal-code', minLength: 2, required: true },
  postalCode: { autoComplete: 'postal-code', minLength: 2, required: true },
  city: { autoComplete: 'address-level2', minLength: 2, required: true },
  province: { autoComplete: 'address-level1', minLength: 2, required: false },
  country: { autoComplete: 'country', minLength: 2, required: true }
};

const FIELD_LABEL_ALIASES: { [name: string]: string } = {
  province: 'zone',
  zone: 'province',
  postalCode: 'zip',
  zip: 'postalCode'
};

type State = {
  email: string;
  emailModified: boolean;
  address: ShippingAddress;
  addressModified: boolean;
  valid: boolean;
  submitted: boolean;

  /** Selected country */
  countryCode: string | null;

  /** Locale used for displaying address fields */
  locale: string;
  invalidFields: Set<string>;
};

class ShippingAddressForm extends Component<Props, State> {
  idPrefix = 'x-' + Math.round(1000 * Math.random()) + '-';

  state = {
    email: '',
    emailModified: false,
    address: {
      firstName: '',
      lastName: '',
      address1: '',
      address2: '',
      province: '',
      city: '',
      country: '',
      zip: '',
      postalCode: '',
      phone: '',
      company: '',
      countryCodeV2: 'US'
    },
    addressModified: false,
    countryCode: 'US',
    locale: 'en',
    invalidFields: new Set<string>(),
    valid: false,
    submitted: false
  };

  async componentDidMount(): Promise<void> {
    const { countryCodes, countriesByCode, imageMaxWidth } = this.props;
    let { checkout } = this.props;
    const community: Community = this.props.community;

    // Ensure a valid checkout exists
    if (!checkout) {
      const r: GetCheckoutResult = await this.props.requestOrResetActiveCheckout({ imageMaxWidth });
      if (!r.error) {
        checkout = r.checkout;
      }
    }

    if (!checkout || checkout.completedAt !== null) {
      this.props.onBackClicked();
      return;
    }

    let countryCode = 'US';
    const locale = getStackendLocale(community?.locale || 'en');
    let countries: Array<Country> | null = null;

    if (!countryCodes) {
      countries = await this.props.requestCountries({ locale });
      countryCode = (locale.split('_')[1] || locale).toUpperCase();
    }

    const country = getCountryOfCheckout(checkout, countryCode, countriesByCode, countries);
    if (country) {
      countryCode = country.code;
    }

    await this.props.requestAddressFields({ countryCode });

    const newState: Partial<State> = {
      locale,
      countryCode,
      email: checkout.email || '',
      address: Object.assign(
        {},
        Object.assign({}, this.state.address, {
          country: country?.name || ''
        }),
        checkout.shippingAddress
      ),
      valid: false
    };

    noNullFields(newState.address);
    this.setState(this.getValidatedState(newState));
  }

  render(): JSX.Element | null {
    const { valid, submitted } = this.state;

    return (
      <Sc.ShippingAddressForm>
        {this.renderFields()}
        <ButtonBox>
          <ButtonPrevious type="button" onClick={this.props.onBackClicked}>
            <FormattedMessage id="shop.cancel" defaultMessage="Cancel" />
          </ButtonPrevious>
          <ButtonNext
            className="stackend-arrow-right"
            type="submit"
            onClick={this.onContinueClicked}
            disabled={!valid || submitted}>
            <FormattedMessage id="shop.shipping" defaultMessage="Shipping" />
          </ButtonNext>
        </ButtonBox>
      </Sc.ShippingAddressForm>
    );
  }

  renderFields = (): JSX.Element | null => {
    const { address, email, countryCode } = this.state;
    const { addressFieldsByCountryCode, checkout } = this.props;
    if (!checkout) {
      return null;
    }
    if (!address || !addressFieldsByCountryCode) {
      return (
        <Sc.Fields>
          <Sc.FieldPlaceholder />
        </Sc.Fields>
      );
    }

    const addressFields = addressFieldsByCountryCode[countryCode];
    if (!addressFields) {
      return (
        <Sc.Fields>
          <Sc.FieldPlaceholder />
        </Sc.Fields>
      );
    }

    return (
      <Sc.Fields>
        <Sc.Field className={this.getFieldClassName(1, 0)}>
          <label htmlFor={this.idPrefix + 'email'}>
            <FormattedMessage id="shop.email" defaultMessage="Email" />:
          </label>
          <input
            id={this.idPrefix + 'email'}
            value={email || ''}
            autoComplete="email"
            onChange={this.onEmailChanged}
            type="email"
            required={true}
          />
        </Sc.Field>

        {checkout.requiresShipping
          ? addressFields.map((g: Array<string>) => {
              if (g.length === 1) {
                return this.renderField(address, g[0], 1, 0);
              } else {
                return g.map((fieldName: string, idx: number) => this.renderField(address, fieldName, g.length, idx));
              }
            })
          : null}
      </Sc.Fields>
    );
  };

  getFieldClassName(groupOf: number, idx: number): string {
    const isLast = idx === groupOf - 1;
    return 'group-of-' + groupOf + (isLast ? ' last' : '') + (idx === 0 ? ' first' : '');
  }

  renderField = (address: ShippingAddress, fieldName: string, groupOf: number, idx: number): JSX.Element | null => {
    if (fieldName === AddressFieldName.Country) {
      return this.renderCountries(groupOf, idx);
    }

    const f = FIELDS[fieldName];
    if (!f) {
      console.error(fieldName + ' ignored');
      return null;
    }

    const { countryCode } = this.state;
    const { countriesByCode } = this.props;
    const country: Country = countriesByCode[countryCode];

    const className = this.getFieldClassName(groupOf, idx);
    let placeHolder = '';
    if (fieldName === AddressFieldName.Phone) {
      placeHolder = '+' + country.phoneNumberPrefix;
    }
    let label = (country.labels as any)[fieldName];
    if (!label) {
      const k = FIELD_LABEL_ALIASES[fieldName];
      if (k) {
        label = (country.labels as any)[k];
      }
    }

    const id = this.idPrefix + fieldName;
    return (
      <Sc.Field key={id} className={className}>
        <label htmlFor={id}>{label}:</label>
        <input
          id={id}
          value={(address as any)[fieldName]}
          name={fieldName}
          autoComplete={f.autoComplete}
          minLength={f.minLength}
          onChange={this.onFieldChanged}
          required={f.required}
          placeholder={placeHolder}
        />
      </Sc.Field>
    );
  };

  renderCountries = (groupOf: number, idx: number): JSX.Element | null => {
    const { countryCode } = this.state;
    const { countriesByCode, countryCodes } = this.props;
    if (!countryCodes) {
      return null;
    }
    const id = this.idPrefix + 'country';
    const className = this.getFieldClassName(groupOf, idx);
    const label = countriesByCode[countryCode].labels['country'];

    return (
      <Sc.Field key={id} className={className}>
        <label htmlFor={id}>{label}:</label>
        <select id={id} size={1} name="country" value={countryCode} onChange={this.onCountryChanged}>
          {countryCodes.map((c: string) => {
            const country = countriesByCode[c];
            return (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            );
          })}
        </select>
      </Sc.Field>
    );
  };

  onEmailChanged = (e: ChangeEvent<HTMLInputElement>): void => {
    this.setState(
      this.getValidatedState({
        email: e.target.value,
        emailModified: true
      })
    );
  };

  onCountryChanged = (e: ChangeEvent<HTMLSelectElement>): void => {
    const { address, locale } = this.state;
    const { countriesByCode } = this.props;
    const countryCode = e.target.value;

    (async (): Promise<void> => {
      const country: Country = countriesByCode[countryCode];
      this.setState({
        countryCode,
        address: Object.assign({}, address, { country: country.name }),
        addressModified: true
      });
      await this.props.requestAddressFields({ locale, countryCode });
    })();
  };

  onFieldChanged = (e: ChangeEvent<HTMLInputElement>): void => {
    const v = e.target.value;
    const n = e.target.getAttribute('name') as string;
    this.setState(
      this.getValidatedState({
        address: Object.assign({}, this.state.address, { [n]: v }) as any,
        addressModified: true
      })
    );
  };

  getValidatedState = (s: Partial<State>): State => {
    const { addressFieldsByCountryCode, checkout } = this.props;

    const x = Object.assign({}, this.state, s);
    x.invalidFields = new Set<string>();
    x.valid = true;

    if (!x.email || !EMAIL_VALIDATION_REGEXP_RELAXED.test(x.email)) {
      x.invalidFields.add('email');
    }

    if (checkout?.requiresShipping) {
      const addressFields = addressFieldsByCountryCode[x.countryCode];

      for (const name of Object.keys(addressFields)) {
        const f = FIELDS[name];
        if (f) {
          if (f.required && (x.address as any)[name].length < f.minLength) {
            x.invalidFields.add(name);
          }
        }
      }
    }

    x.valid = x.invalidFields.size === 0;
    return x;
  };

  onContinueClicked = async (e: MouseEvent): Promise<void> => {
    e.stopPropagation();
    e.preventDefault();

    const { valid, email, emailModified, address, locale, countryCode } = this.state;
    const { checkout } = this.props;

    if (!valid || !checkout) {
      return;
    }

    this.setState({
      submitted: true
    });

    let r: CheckoutResult | null = null;

    if (emailModified) {
      r = await this.props.checkoutSetEmail({
        checkoutId: checkout.id,
        email
      });
      if (handleCheckoutError(r as CheckoutResult)) {
        return;
      }
    }

    if (checkout.requiresShipping) {
      // The country name needs to be in english to be accepted
      let addr = address;
      if (locale !== 'en_US') {
        const country: Country = await this.props.getCountry({ locale: 'en_US', countryCode });
        if (country) {
          addr = Object.assign({}, address, {
            country: country.name
          });
        }
      }

      r = await this.props.updateShippingAddress({
        checkoutId: checkout.id,
        address: addr
      });

      if (handleCheckoutError(r as CheckoutResult)) {
        return;
      }
    }

    if (r && this.props.onContinueClicked) {
      this.props.onContinueClicked(r?.response?.checkout || checkout);
    }
  };
}

export default injectIntl(connector(ShippingAddressForm));

function noNullFields<T>(p: T): T {
  for (const k of Object.keys(p)) {
    if ((p as any)[k] === null) {
      (p as any)[k] = '';
    }
  }

  return p;
}

function handleCheckoutError(r: CheckoutResult): boolean {
  // FIXME: Improve error messages
  if (r.error) {
    alert('Checkout failed. Try again later\n' + getJsonErrorText(r));
    return true;
  }

  if (r.response.checkoutUserErrors.length !== 0) {
    let msg = '';
    r.response.checkoutUserErrors.forEach(e => {
      msg += e.message;
    });
    console.error(msg, r);
    alert(msg);
    return true;
  }

  return false;
}

/**
 * Figure out the correct country code of a checkout
 * @param checkout
 * @param defaultCountryCode
 * @param countriesByCode
 * @param countries
 */
function getCountryOfCheckout(
  checkout: Checkout,
  defaultCountryCode: string,
  countriesByCode: { [code: string]: Country },
  countries: Array<Country> | null
): Country | null {
  const cc = checkout?.shippingAddress?.countryCodeV2 || defaultCountryCode;
  let c: Country | null = null;

  if (countriesByCode) {
    c = countriesByCode[cc];
    if (c) {
      return c;
    }
  }

  if (countries) {
    const x = countries.find((c: Country) => c.code === cc);
    return x || null;
  }

  return null;
}
