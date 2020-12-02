//@flow

import styled from 'styled-components';
import { StackendCarouselStyle } from './CarouselCommon';
import { ProductListingItem } from './ProductListingItem.style';

export const ProductCarouselListing = styled.div.attrs({ className: 'stackend-shop-collection' })`
  margin: 1em 0;
  ${StackendCarouselStyle}

  ${ProductListingItem} {
    min-width: 10em;
  }
`;
