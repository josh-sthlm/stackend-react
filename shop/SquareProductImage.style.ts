//@flow
import styled from 'styled-components';
import classNames from '../style-common/classNames';

export const SquareProductImage = styled.div.attrs( props => ({className: classNames('stackend-square-product-image', props.className) }))`
  overflow: hidden;
  height: 200px;
  width: 200px;
  background: white;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &.stackend-responsive {
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
`;
