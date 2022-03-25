//@flow

import styled from 'styled-components';
import { ButtonNext, Price, Title } from './Shop.style';
import media from '../style-common/media';
import { NumberEntry } from '../ui/NumberEntry.style';
import classNames from '../style-common/classNames';
import { SquareProductImage } from './SquareProductImage.style';

export const BasketItem = styled.li.attrs(props => ({
  className: classNames('stackend-basket-list-item', props.className)
}))`
  &.stackend-basket-item-placeholder {
    height: 10.772em;
    ${media.mobileScreen} {
      height: 16em;
    }
  }

  a.stackend-product-image-link {
    padding: ${props => props.theme.borderWidth}; /* space for focus outline */
  }

  ${SquareProductImage} {
    img {
      object-fit: cover;
    }
  }
`;

export const BasketList = styled.ul.attrs(props => ({
  className: classNames('stackend-basket-list', props.className)
}))``;
export const BasketTotalPrice = styled.div.attrs(props => ({
  className: classNames('stackend-basket-total', props.className)
}))``;
export const BasketEmpty = styled.p.attrs(props => ({
  className: classNames('stackend-basket-empty', props.className)
}))``;
export const BasketActions = styled.div.attrs(props => ({
  className: classNames('stackend-basket-actions', props.className)
}))``;

export const BasketLine = styled.div.attrs(props => ({
  className: classNames('stackend-basket-line', props.className)
}))`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 1em;
  ${media.mobileScreen} {
    flex-direction: column;
    align-items: end;
  }
`;

export const Basket = styled.div.attrs(props => ({
  className: classNames('stackend-basket', props.className)
}))`
  overflow: hidden;
  padding: ${props => props.theme.margins.small};

  ${BasketActions} {
    text-align: right;
    ${BasketTotalPrice} {
      display: block;
    }
    ${ButtonNext} {
      margin-top: 2em;
    }
  }

  ${BasketEmpty} {
    margin-left: 0;
    margin-right: 0;
    height: 20em;
  }

  .stackend-shop-checkout {
    text-align: center;
  }

  ${BasketList} {
    ${BasketItem} {
      margin-bottom: 1em;
      padding: 1em;

      display: grid;
      grid-template-columns: min-content 1fr min-content min-content min-content;
      grid-template-areas: 'image title quantity price remove';
      align-items: center;
      grid-gap: 1em;

      .stackend-product-title {
        grid-area: title;
        ${Title} {
          display: inline-block;
        }
      }

      ${NumberEntry} {
        grid-area: quantity;
      }

      ${Price} {
        grid-area: price;
      }

      .stackend-remove-product {
        grid-area: remove;
      }

      ${media.mobileScreen} {
        grid-template-columns: 33% min-content auto auto min-content;
        grid-template-rows: repeat(2, auto);
        grid-template-areas:
          'image title title title remove'
          'image quantity quantity price price';
        align-items: center;
        justify-items: start;
        grid-gap: 0.5em;
        font-size: 0.9em;

        .stackend-product-title {
          align-self: start;
          ${Title} {
            margin: 0;
            max-height: 4.5em; /* 3 lines of text */
            overflow: hidden;
            text-overflow: ellipsis;
            line-clamp: 3;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
          }
        }

        .stackend-remove-product {
          justify-self: end;
          align-self: start;
          margin: 0;
          padding-top: 0;
          padding-right: 0;
        }

        a.stackend-product-image-link {
          align-self: start;
        }

        ${NumberEntry}, ${Price} {
          align-self: end;
        }

        ${NumberEntry} button {
          margin-bottom: 0;
          margin-top: 0;
          padding-bottom: 0;
          padding-top: 0;
        }

        ${NumberEntry} button:first-child {
          margin-left: 0;
        }

        ${Price} {
          justify-self: end;
          margin-bottom: 1em;
        }
      }

      a.stackend-product-image-link {
        grid-area: image;
        width: 10vw;

        ${media.mobileScreen} {
          width: 100%;
        }
      }
    }
  }
`;
