//@flow
import styled from 'styled-components';
import classNames from '../style-common/classNames';

export const ProductTypeTreeListing = styled.ul.attrs(props => ({ className: classNames('stackend-product-tree-listing', props.className) }))`

  li {
    display: none;
    &.open {
      display: block;
    }
  }

  &.stackend-product-tree-root {
    > li {
      display: block;
      > a {
        font-weight: bold;
      }
      ul {
        margin-left: 1em;
      }
    }
  }
}
`;
