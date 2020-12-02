//@flow
import styled from 'styled-components';

export const ProductTypeTreeListing = styled.ul.attrs({ className: 'stackend-product-tree-listing' })`

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
