//@flow
import styled from 'styled-components';

export const ShopApp = styled.div.attrs({ className: 'stackend-shop-app' })`
  display: grid;
  grid-column-gap: 2em;
  grid-template-columns: min-content auto;
`;

export const AddToBasketButton = styled.button.attrs({ className: 'stackend-buy' })``;

export const ProductListing = styled.div.attrs({ className: 'stackend-product-listing' })``;

export const Products = styled.ul.attrs({ className: 'stackend-products' })`
  display: flex;
  flex-wrap: wrap;
  list-style-type: none;

  li {
    margin-right: 10px;
    margin-bottom: 10px;
    text-align: center;
    a {
      text-decoration: none;
      color: inherit;
    }
  }
`;

export const ShopNow = styled.span.attrs({ className: 'stackend-shop-now' })`
  display: inline-block;
  margin: 1em 0;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  padding: 3px;
`;

export const ProductLink = styled.a.attrs({ className: 'stackend-product-link' })``;

export const ProductListingImage = styled.img.attrs({ className: 'stackend-product-image' })``;

export const Title = styled.h2.attrs({ className: 'stackend-product-name' })``;
export const Price = styled.div.attrs({ className: 'stackend-product-price' })``;

export const Product = styled.div.attrs({ className: 'stackend-product' })`
  text-align: center;
`;

export const ProductImageBrowser = styled.div.attrs({
  className: 'stackend-product-image-browser'
})``;

export const ProductMissingError = styled.div.attrs({ className: 'stackend-product-missing' })``;

export const ProductTypeListing = styled.nav.attrs({ className: 'stackend-product-types' })`
  white-space: nowrap;
  list-style-type: none;
`;
