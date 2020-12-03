//@flow

import styled from 'styled-components';
import { StackendCarouselStyle } from './CarouselCommon';
import { ProductListingItem } from './ProductListingItem.style';
import classNames from '../style-common/classNames';

export const ProductCarouselListing = styled.div.attrs(props => ({ className: classNames('stackend-shop-collection', props.className) }))`
  margin: 1em 0;
  ${StackendCarouselStyle}

  ${ProductListingItem} {
    min-width: 10em;
  }
`;
