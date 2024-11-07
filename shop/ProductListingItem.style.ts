//@flow
import styled from 'styled-components';
import { Price, Title } from './Shop.style';
import { SquareProductImage } from './SquareProductImage.style';
import classNames from '../style-common/classNames';
import { headingFontSize } from '../theme/StackendTheme';
import ComponentType from '../theme/ComponentType';
import media from '../style-common/media';

export const ProductListingItem = styled.div.attrs(props => ({
  className: classNames('stackend-product-list-item', props.className)
}))`
  border-radius: calc(${props => props.theme.shopifyBorderRadius} * 0.5);
  border: solid ${props => props.theme.borderWidth} transparent; /* gives space to outline when link is focused */
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  overflow: hidden;
  background-color: #ffffff54;
  padding: 10px;

  a {
    text-decoration: none;
    display: inline-block;
    width: 100%;
    padding-bottom: ${props => props.theme.margins.medium};

    ${Title} {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: break-spaces;
      word-break: break-word;
      display: -webkit-box;
      line-clamp: 2;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      ${media.mobileScreen} {
        font-size: ${props => headingFontSize(props.theme, ComponentType.H4)};
      }
    }

    ${SquareProductImage} {
      width: 100%;
      height: auto;
      position: relative;

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
      color: ${props => props.theme.color};
    }
  }
`;
