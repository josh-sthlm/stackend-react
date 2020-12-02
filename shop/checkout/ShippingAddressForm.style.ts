//@flow

import styled from 'styled-components';
import media from '../../style-common/media';

export const Fields = styled.div.attrs({ className: 'stackend-shop-checkout-shipping-fields' })``;
export const Field = styled.div.attrs({ className: 'stackend-shop-checkout-shipping-field' })`
  label {
    display: block;
  }
  input,
  select {
    width: 100%;
  }
`;

export const FieldPlaceholder = styled.div.attrs({ className: 'stackend-shop-checkout-shipping-field-placeholder' })`
  min-height: 100vh;
`;

export const ShippingAddressForm = styled.form.attrs({ className: 'stackend-shop-checkout-shipping-address' })`
  overflow: hidden;

  h1 {
    text-align: center;
  }

  ${Fields} {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 1em;
    align-items: center;

    ${Field} {
      padding-right: 4px; /* Hack to fix overflow */
      &.group-of-1 {
        grid-column: span 4;
      }

      &.group-of-2 {
        grid-column: span 2;
      }

      &.group-of-3 {
        grid-column: span 1;
        &.first {
          grid-column: span 2;
        }
      }

      input,
      select {
        margin-left: 0;
        margin-right: 0;
      }
    }

    ${media.mobileScreen} {
      grid-template-columns: 1fr;
      ${Field} {
        &.group-of-1,
        &.group-of-2,
        &.group-of-3,
        &.group-of-3.first {
          grid-column: span 1;
        }

        input,
        select {
          width: calc(100% - var(--universal-margin));
        }
      }
    }
  }
`;
