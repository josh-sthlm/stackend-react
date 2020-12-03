//@flow

import styled from 'styled-components';
import media from '../style-common/media';
import { ProductListingItem } from './ProductListingItem.style';
import classNames from '../style-common/classNames';

export const Products = styled.ul.attrs(props => ({ className: classNames('stackend-products', props.className) }))`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 1em 1em;
  justify-items: stretch;
  list-style-type: none;

  ${media.mobileScreen} {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const ProductListing = styled.div.attrs(props => ({ className: classNames('stackend-product-listing', props.className) }))`
  &.stackend-product-listing-placeholder {
    ${ProductListingItem} {
      height: 20em;
      background-color: rgba(255, 255, 255, 0.5);
    }
  }
`;
