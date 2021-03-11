//@flow

import styled from 'styled-components';

import media from '../style-common/media';
import { Description, Price, Title, Sku } from './Shop.style';
import classNames from '../style-common/classNames';

export const ProductDetails = styled.div.attrs(props => ({
  className: classNames('stackend-product-details', props.className)
}))``;

export const Actions = styled.div.attrs(props => ({
  className: classNames('stackend-product-actions', props.className)
}))``;

export const Product = styled.div.attrs(props => ({ className: classNames('stackend-product', props.className) }))`
  text-align: center;
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto auto auto;
  grid-template-areas: 'details' 'actions' 'description';

  > ${Title} {
    display: none;
    grid-area: title;
  }

  ${Sku} {
    display: none;
  }

  > ${Sku} {
    grid-area: sku;
  }

  ${ProductDetails} {
    grid-area: details;
  }

  ${Description} {
    grid-area: description;
    text-align: left;
  }

  ${Actions} {
    grid-area: actions;
  }

  ${Price} {
    display: block;
  }

  ${media.overMobile} {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: minmax(1em, min-content) minmax(1em, min-content) auto;
    grid-template-areas:
      'title title'
      'details description'
      'details actions';
    grid-gap: 1em;
    > ${Title} {
      display: block;
      font-size: 2em;
    }
    ${ProductDetails} > ${Title} {
      display: none;
    }
  }
`;
