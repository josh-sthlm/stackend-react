//@flow
import styled from 'styled-components';
import { Price, Title } from './Shop.style';
import { SquareProductImage } from './SquareProductImage.style';
import classNames from '../style-common/classNames';
import { getComponentProp, headingFontSize } from '../theme/StackendTheme';
import ComponentType from '../theme/ComponentType';
import media from '../style-common/media';

export const ProductListingItem = styled.div.attrs(props => ({
  className: classNames('stackend-product-list-item', props.className)
}))`
  text-align: center;
  background: ${props => getComponentProp(props.theme, ComponentType.BOX, 'backgroundColor')};
  border-radius: ${props => props.theme.borderRadius};
  border: solid ${props => props.theme.borderWidth} transparent; /* gives space to outline when link is focused */
  display: flex;
  justify-content: flex-end;
  flex-direction: column;

  a {
    text-decoration: none;
    display: inline-block;
    width: 100%;

    ${Title} {
      line-height: 1.2em;
      height: 2.4em; /* 2 * line-height */
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: break-spaces;
      word-break: break-word;
      margin: 0.5em 0.5em 0 0.5em;
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
