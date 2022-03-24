import styled from 'styled-components';
import { getComponentProp } from '../theme/StackendTheme';
import ComponentType from '../theme/ComponentType';

export const ProductImageModal = styled.div.attrs(props => ({
  className: 'stackend-product-image-modal'
}))`
  position: relative;

  button.stackend-close {
    font-size: 3em;
    position: absolute;
    top: 0;
    right: 0;
  }

  button.stackend-previous,
  button.stackend-next {
    width: auto;
    height: auto;
    z-index: 10;
    text-shadow: 0 0 5px ${props => getComponentProp(props.theme, ComponentType.BUTTON, 'backgroundColor') || '#222'};
    color: ${props => getComponentProp(props.theme, ComponentType.BUTTON, 'backgroundColor') || 'black'};
    background: rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    font-size: 4rem;
    position: absolute;
  }

  button.stackend-previous {
    left: 0;
    top: 50%;
  }

  button.stackend-next {
    right: 0;
    top: 50%;
  }

  img {
    width: auto;
    height: calc(100vh - 4em);
    object-fit: contain;
  }
`;
