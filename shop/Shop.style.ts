//@flow
import styled from 'styled-components';

export const ShopButtonCommon = `
  display: inline-block;
  margin: 1em 0;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  border-left: none;
  border-right: none;
  border-radius: 0;
  padding: .5em;
  font-weight: 300;
  width: fit-content;
`;

export const ShopNowButton = styled.span.attrs({ className: 'stackend-shop-now' })`
  ${ShopButtonCommon}
`;

const productItemMargin = '1em 0;';

export const ProductTitlePart = styled.span.attrs({ className: 'stackend-product-title' })``;
export const VariantTitlePart = styled.span.attrs({ className: 'stackend-variant-title' })``;

export const Title = styled.h2.attrs({ className: 'stackend-product-name' })`
  margin: ${productItemMargin};
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-weight: 300;
  font-size: 1.2em;

  ${ProductTitlePart} {
    display: block;
  }

  ${VariantTitlePart} {
    display: block;
    font-size: 0.8em;
  }
`;

export const Quantity = styled.span.attrs({ className: 'stackend-shop-quantity' })``;

export const Description = styled.div.attrs({ className: 'stackend-product-description' })`
  *:first-child {
    margin-top: 0;
  }

  iframe {
    max-width: 100%;
  }
`;

export const Price = styled.span.attrs({ className: 'stackend-product-price' })`
  margin: ${productItemMargin};
`;

export const Tags = styled.div.attrs({ className: 'stackend-tags' })`
  margin: ${productItemMargin};
  text-transform: uppercase;
`;

export const ButtonBox = styled.div.attrs({ className: 'stackend-button-box' })`
  margin-top: 1em;
  margin-bottom: 1em;
  display: flex;
  justify-content: space-between;

  button {
    margin-left: 0;
    margin-right: 0;
  }
`;

export const ButtonNext = styled.button.attrs({ className: 'stackend-button-next' })`
  ${ShopButtonCommon}
`;

export const ButtonPrevious = styled.button.attrs({ className: 'stackend-button-previous' })`
  ${ShopButtonCommon}
`;
