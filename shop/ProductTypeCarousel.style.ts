//@flow
import styled from 'styled-components';
import { StackendCarouselStyle } from './CarouselCommon';

export const ProductTypeCarousel = styled.div.attrs({ className: 'stackend-product-types-carousel' })`
  margin: 1em 0;
  ${StackendCarouselStyle}

  .stackend-product-type-carousel-item {
    text-align: center;
    user-select: none;
    overflow: hidden;
    font-size: 1.2rem;
    height: 15em;
    width: 15em;
    display: block;
    color: white;
    text-transform: uppercase;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    background-color: gray;
    cursor: pointer;
    a {
      display: block;
      color: white;
      line-height: 15em;
    }
  }
`;
