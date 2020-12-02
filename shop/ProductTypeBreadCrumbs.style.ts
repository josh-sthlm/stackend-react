//@flow

import styled from 'styled-components';

export const ProductTypeBreadCrumbs = styled.div.attrs({ className: 'stackend-shop-bread-crumbs' })`
  margin: 1em 0;

  span {
    vertical-align: bottom;
    font-size: 1.25em;
    display: inline-block;
    font-weight: bold;
  }

  a {
    font-weight: 100;
  }

  a:last-child {
    font-weight: 400;
  }

  .material-icons {
    padding: 0 0.5em;
  }
`;
