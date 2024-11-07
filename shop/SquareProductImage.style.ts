//@flow
import styled from 'styled-components';
import classNames from '../style-common/classNames';

export const SquareProductImage = styled.div.attrs(props => ({
  className: classNames('stackend-square-product-image', props.className)
}))<{
  src: string;
  randomId: string;
}>`
  overflow: hidden;
  width: 100%;
  border-radius: calc(${props => props.theme.shopifyBorderRadius} * 0.5);
  background-size: cover;
  display: block;
  aspect-ratio: 1;
  background-repeat: no-repeat;

  &.${props => props.randomId} {
    background-image: url(${props => props.src});
    background-position: center center;
  }
`;
