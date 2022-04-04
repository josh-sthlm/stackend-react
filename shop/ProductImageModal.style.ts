import styled from 'styled-components';
import { getComponentProp } from '../theme/StackendTheme';
import ComponentType from '../theme/ComponentType';
import { zIndexes } from '../style-common/z-indexes';
import media from '../style-common/media';

export const ProductImageModal = styled.div.attrs(props => ({
  className: 'stackend-product-image-modal'
}))`
  position: relative;
  text-align: center;

  button {
    z-index: ${zIndexes.modal + 10};
    font-size: 3rem;
  }

  button.stackend-close {
    position: absolute;
    top: 0;
    right: 0;
  }

  button.stackend-previous,
  button.stackend-next {
    width: auto;
    height: auto;
    text-shadow: 0 0 5px ${props => getComponentProp(props.theme, ComponentType.BUTTON, 'backgroundColor') || '#222'};
    color: ${props => getComponentProp(props.theme, ComponentType.BUTTON, 'backgroundColor') || 'black'};
    background: ${props =>
      getComponentProp(props.theme, ComponentType.BUTTON, 'color') + '22' || 'rgba(255, 255, 255, 0.5)'};
    border-radius: 50%;
    position: absolute;
    &:hover,
    &:active {
      background: ${props =>
        getComponentProp(props.theme, ComponentType.BUTTON, 'color') + '22' || 'rgba(255, 255, 255, 0.5)'};
    }
  }

  button.stackend-previous,
  button.stackend-next {
    top: 50%;
    ${media.mobileScreen} {
      font-size: 2rem;
    }
  }

  button.stackend-previous {
    left: 1rem;
  }

  button.stackend-next {
    right: 1rem;
  }

  img {
    width: auto;
    height: calc(100vh - 4em);
    object-fit: contain;
    max-width: 100%;
    max-height: 100%;
  }
`;
