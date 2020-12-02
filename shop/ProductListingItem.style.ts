//@flow
import styled from 'styled-components';
import { Price, Title } from './Shop.style';
import { SquareProductImage } from './SquareProductImage.style';

export const ProductListingItem = styled.div.attrs({ className: 'stackend-product-list-item' })`
  text-align: center;
  background: white;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;

  a {
    text-decoration: none;
    display: inline-block;
    width: 100%;

    ${Title} {
      height: 2.4em; /* 2 * line-height */
      overflow: hidden;
      text-overflow: ellipsis;
      margin: 0.5em 0.5em 0 0.5em;
      display: -webkit-box;
      line-clamp: 2;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    ${SquareProductImage} {
      width: 100%;
      height: auto;
      position: relative;
      padding-bottom: 100%;
      img {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }

    ${Price} {
      display: block;
    }
  }
`;
