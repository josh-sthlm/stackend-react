import styled from 'styled-components';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import classNames from '../../style-common/classNames';
import { SquareProductImage } from '../../shop/SquareProductImage.style';
import { Price, ShopNowButton, Title } from '../../shop/Shop.style';

export const ProductModule = styled.div.attrs(props => ({
  className: classNames('stackend-shop-product-module', props.className)
}))`
  .stackend-product-image-browser .stackend-product-image-browser-thumbs img {
    width: 100%;
    height: 100%;
  }

  &.stackend-shop-product-module-horizontal {
    display: inline-block;
    > .stackend-product-list-item {
      width: 25em;
      > a {
        display: grid;
        grid-template-columns: min-content auto;
        grid-template-rows: auto auto auto;
        grid-template-areas: 'image title' 'image price' 'image shop-now';
        justify-items: center;
        align-items: center;
        grid-gap: 0.5em;
        margin: 0.5em;
        width: auto;

        ${SquareProductImage} {
          grid-area: image;
          justify-self: start;
          width: 8em;
        }

        ${Title} {
          grid-area: title;
          margin: 0;
        }

        ${Price} {
          grid-area: price;
          margin: 0;
        }

        ${ShopNowButton} {
          grid-area: shop-now;
          margin: 0;
        }
      }
    }
  }
`;
