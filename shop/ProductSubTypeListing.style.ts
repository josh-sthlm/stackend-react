//@flow

import styled from 'styled-components';
import classNames from '../style-common/classNames';

export const ProductSubTypeListing = styled.ul.attrs(props => ({
  className: classNames('stackend-product-sub-types', props.className)
}))`
  margin: 1em 0;

  li {
    display: inline-block;
    margin-right: 1em;
    font-weight: 300;
  }
`;
