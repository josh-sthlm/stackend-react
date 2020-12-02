//@flow
import styled from 'styled-components';

export const SquareProductImage = styled.div.attrs({ className: 'stackend-square-product-image' })`
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
