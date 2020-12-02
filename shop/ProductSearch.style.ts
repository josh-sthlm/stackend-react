//@flow
import styled from 'styled-components';
import media from '../style-common/media';

export const ProductSearchForm = styled.form.attrs({ className: 'stackend-product-search-form' })``;

export const ProductSearch = styled.div.attrs({ className: 'stackend-product-search' })`
  ${ProductSearchForm} {
    margin-bottom: 2em;

    .stackend-search-field {
      display: flex;
      input[type='search'] {
        flex-grow: 1;
        margin-left: 0;
      }

      button[type='submit'] {
        background-image: url('${require('../../public/img/search.svg')}');
        background-repeat: no-repeat;
        background-position: center;
      }
    }
  }
`;

export const SearchOptions = styled.div.attrs({ className: 'stackend-product-search-options' })`
  display: grid;
  grid-template-columns: min-content min-content auto min-content;
  align-items: center;

  .stackend-product-filter {
    text-align: left;
    width: fit-content;
  }
  .stackend-product-sort-label,
  .stackend-product-sort {
    text-align: right;
  }
  .stackend-product-filters-label {
    margin-left: 0;
    padding-left: 0;
  }

  .stackend-product-sort-label,
  .stackend-product-filters-label {
    white-space: nowrap;
  }

  ${media.mobileScreen} {
    grid-template-columns: min-content auto;
    grid-template-rows: auto auto;
    .stackend-product-filters-label {
      text-align: right;
    }
  }
`;

export const ProductTypeMatches = styled.div.attrs({ className: 'stackend-product-type-matches' })`
  margin: 1em 0;
  .stackend-product-type-match-label {
    font-weight: 400;
  }

  a::after {
    content: ', ';
  }

  a:last-child::after {
    content: none;
  }
`;

export const NoMatches = styled.p.attrs({ className: 'stackend-search-no-matches' })``;
