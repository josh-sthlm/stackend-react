//@flow

import styled from 'styled-components';
import media from '../style-common/media';
import { ProductListingItem } from './ProductListingItem.style';

export const Products = styled.ul.attrs({ className: 'stackend-products' })`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 1em 1em;
  justify-items: stretch;
  list-style-type: none;

  ${media.mobileScreen} {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const ProductListing = styled.div.attrs({ className: 'stackend-product-listing' })`
  &.stackend-product-listing-placeholder {
    ${ProductListingItem} {
      height: 20em;
      background-color: rgba(255, 255, 255, 0.5);
    }
  }
`;
