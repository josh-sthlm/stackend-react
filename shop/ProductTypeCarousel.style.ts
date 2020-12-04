//@flow
import styled from 'styled-components';
import { StackendCarouselStyle } from './CarouselCommon';
import classNames from '../style-common/classNames';

export const ProductTypeCarousel = styled.div.attrs(props => ({
  className: classNames('stackend-product-types-carousel', props.className)
}))`
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
