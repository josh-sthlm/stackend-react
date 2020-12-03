//@flow

import styled from 'styled-components';
import classNames from '../style-common/classNames';

export const ProductCollectionDescription = styled.div.attrs(props => ({ className: classNames('stackend-shop-collection-description', props.className) }))`
  margin: 1em 0;
`;

export const ProductCollectionListingContainer = styled.div.attrs(props => ({ className: classNames('stackend-shop-collection', props.className) }))`
  .stackend-product-carousel-item {
    margin: 0 0.5em;
  }
`;
