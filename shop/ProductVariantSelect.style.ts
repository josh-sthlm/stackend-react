import styled from 'styled-components';
import classNames from '../style-common/classNames';

export const ProductVariantSelect = styled.div.attrs(props => ({
  className: classNames('stackend-product-variant-select', props.className)
}))`
  display: grid;
  grid-template-columns: min-content min-content;
  align-items: center;
  justify-content: center;
  grid-gap: 1em;
  label {
    text-align: right;
  }

  select {
    option.stackend-product-variant-label {
      display: none;
    }
  }
`;
