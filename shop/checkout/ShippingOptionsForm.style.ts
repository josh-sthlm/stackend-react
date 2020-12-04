//@flow

import styled from 'styled-components';
import { Price, Quantity, Title } from '../Shop.style';
import classNames from '../../style-common/classNames';

export const Fields = styled.div.attrs(props => ({
  className: classNames('stackend-shop-checkout-shipping-fields', props.className)
}))``;

export const ShippingOption = styled.div.attrs(props => ({
  className: classNames('stackend-shop-checkout-shipping-option', props.className)
}))`
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

export const Product = styled.div.attrs(props => ({
  className: classNames('stackend-shop-checkout-shipping-product', props.className)
}))``;
export const ProductList = styled.div.attrs(props => ({
  className: classNames('stackend-shop-checkout-shipping-products', props.className)
}))`
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

export const TotalPriceLabel = styled.span.attrs(props => ({
  className: classNames('stackend-shop-checkout-shipping-total-label', props.className)
}))``;
export const TotalPrice = styled.div.attrs(props => ({
  className: classNames('stackend-shop-checkout-shipping-total', props.className)
}))`
  margin: 2em 0;
  text-align: right;
  ${Price} {
    display: inline;
    font-weight: bold;
  }
`;

export const ShippingOptionsForm = styled.form.attrs(props => ({
  className: classNames('stackend-shop-checkout-shipping-options', props.className)
}))`
  margin: 2em 0;
`;
