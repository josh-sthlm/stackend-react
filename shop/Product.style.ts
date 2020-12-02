//@flow

import styled from 'styled-components';

import media from '../style-common/media';
import { Description, Price, Title } from './Shop.style';


export const ProductDetails = styled.div.attrs({ className: 'stackend-product-details' })``;

export const ProductOptions = styled.div.attrs({ className: 'stackend-product-options' })`
  display: grid;
  grid-template-columns: min-content min-content;
  align-items: center;
  justify-content: center;
  label {
    text-align: right;
  }
`;

export const Actions = styled.div.attrs({ className: 'stackend-product-actions' })``;

export const Product = styled.div.attrs({ className: 'stackend-product' })`
  text-align: center;
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto auto auto;
  grid-template-areas: 'details' 'actions' 'description';

  > ${Title} {
    display: none;
    grid-area: title;
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
    grid-template-rows: min-content minmax(0, min-content) minmax(0, min-content);
    grid-template-areas: 'title title' 'details description' 'details actions';
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

export const ProductImageBrowser = styled.div.attrs({ className: 'stackend-product-image-browser' })`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ProductImageBrowserThumbnails = styled.ul.attrs({ className: 'stackend-product-image-browser-thumbs' })`
  margin-top: 1em;
  li {
    display: inline-block;
    margin: 0.5em;

    button {
      width: 4em;
      height: 4em;
      margin: 0;
      padding: 0;
      background: white;
      overflow: hidden;
      border: none;

      img {
        object-fit: contain;
        vertical-align: middle;
      }
    }
  }
`;
