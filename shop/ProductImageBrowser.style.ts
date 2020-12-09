import styled from 'styled-components';
import classNames from '../style-common/classNames';

export const ProductImageBrowser = styled.div.attrs(props => ({
  className: classNames('stackend-product-image-browser', props.className)
}))`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ProductImageBrowserThumbnails = styled.ul.attrs(props => ({
  className: classNames('stackend-product-image-browser-thumbs', props.className)
}))`
  margin-top: 1em;
  li {
    display: inline-block;
    margin: 0.5em;

    button {
      width: 4em;
      height: 4em;
      margin: 0;
      padding: 0;
      background: white;
      overflow: hidden;
      border: none;

      img {
        object-fit: contain;
        vertical-align: middle;
      }
    }
  }
`;
