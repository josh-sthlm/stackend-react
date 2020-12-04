//@flow
import styled from 'styled-components';
import classNames from '../style-common/classNames';

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

export const ShopNowButton = styled.span.attrs(props => ({
  className: classNames('stackend-shop-now', props.className)
}))`
  ${ShopButtonCommon}
`;

const productItemMargin = '1em 0;';

export const ProductTitlePart = styled.span.attrs(props => ({
  className: classNames('stackend-product-title', props.className)
}))``;
export const VariantTitlePart = styled.span.attrs(props => ({
  className: classNames('stackend-variant-title', props.className)
}))``;

export const Title = styled.h2.attrs(props => ({ className: classNames('stackend-product-name', props.className) }))`
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

export const Quantity = styled.span.attrs(props => ({
  className: classNames('stackend-shop-quantity', props.className)
}))``;

export const Description = styled.div.attrs(props => ({
  className: classNames('stackend-product-description', props.className)
}))`
  *:first-child {
    margin-top: 0;
  }

  iframe {
    max-width: 100%;
  }
`;

export const Price = styled.span.attrs(props => ({ className: classNames('stackend-product-price', props.className) }))`
  margin: ${productItemMargin};
`;

export const Tags = styled.div.attrs(props => ({ className: classNames('stackend-tags', props.className) }))`
  margin: ${productItemMargin};
  text-transform: uppercase;
`;

export const ButtonBox = styled.div.attrs(props => ({ className: classNames('stackend-button-box', props.className) }))`
  margin-top: 1em;
  margin-bottom: 1em;
  display: flex;
  justify-content: space-between;

  button {
    margin-left: 0;
    margin-right: 0;
  }
`;

export const ButtonNext = styled.button.attrs(props => ({
  className: classNames('stackend-button-next', props.className)
}))`
  ${ShopButtonCommon}
`;

export const ButtonPrevious = styled.button.attrs(props => ({
  className: classNames('stackend-button-previous', props.className)
}))`
  ${ShopButtonCommon}
`;
