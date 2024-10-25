import styled from 'styled-components';
import classNames from '../style-common/classNames';

export const ProductImageBrowser = styled.div.attrs(props => ({
  className: classNames('stackend-product-image-browser', props.className)
}))`
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    max-width: 100%;
    height: auto;
    border-radius: calc(${props => props.theme.shopifyBorderRadius} * 0.5);
  }
`;

export const ProductImageBrowserThumbnails = styled.ul.attrs(props => ({
  className: classNames('stackend-product-image-browser-thumbs', props.className)
}))`
  img {
    max-width: 100%;
    height: auto;
  }

  margin-top: 1em;
  li {
    display: inline-block;
    margin: 0.5em;

    button {
      width: 4em;
      height: 4em;
      margin: 0;
      padding: 0;
      background: ${props => props.theme?.backgroundColor || 'white'};
      overflow: hidden;
      border: none;
      border-radius: ${props => props.theme?.borderRadius || '3px'};

      img {
        object-fit: cover;
        vertical-align: middle;
      }
    }
  }
`;
