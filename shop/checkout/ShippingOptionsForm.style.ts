//@flow

import styled from 'styled-components';
import { Price, Quantity, Title } from '../Shop.style';

export const Fields = styled.div.attrs({ className: 'stackend-shop-checkout-shipping-fields' })``;

export const ShippingOption = styled.div.attrs({ className: 'stackend-shop-checkout-shipping-option' })`
  display: flex;
  align-items: center;
  margin-top: 1em;
  ${Price} {
    display: inline;
    &:before {
      content: ' - ';
      margin: 0 1em;
    }
  }
`;

export const Product = styled.div.attrs({ className: 'stackend-shop-checkout-shipping-product' })``;
export const ProductList = styled.div.attrs({ className: 'stackend-shop-checkout-shipping-products' })`
  margin-bottom: 2em;
  ${Product} {
    display: grid;
    grid-template-columns: min-content auto min-content;
    align-items: center;
    grid-gap: 1em;
    margin-bottom: 1em;
    ${Quantity} {
      text-align: right;
      white-space: nowrap;
      &:after {
        content: ' ⨉';
      }
    }
    ${Title} {
      margin: 0;
    }
    ${Price} {
      margin: 0;
    }
  }
`;

export const TotalPriceLabel = styled.span.attrs({ className: 'stackend-shop-checkout-shipping-total-label' })``;
export const TotalPrice = styled.div.attrs({ className: 'stackend-shop-checkout-shipping-total' })`
  margin: 2em 0;
  text-align: right;
  ${Price} {
    display: inline;
    font-weight: bold;
  }
`;

export const ShippingOptionsForm = styled.form.attrs({ className: 'stackend-shop-checkout-shipping-options' })`
  margin: 2em 0;
`;
