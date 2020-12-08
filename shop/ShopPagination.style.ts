//@flow
import styled from 'styled-components';
import classNames from '../style-common/classNames';

export const ShopPagination = styled.div.attrs(props => ({
  className: classNames('stackend-shop-pagination', props.className)
}))`
  text-align: center;
  margin: 1em auto;

  .stackend-shop-pagination-label {
    display: none;
  }
`;
