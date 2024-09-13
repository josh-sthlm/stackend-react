//@flow
import styled from 'styled-components';
import classNames from '../style-common/classNames';
import { getComponentProp } from '../theme/StackendTheme';
import ComponentType from '../theme/ComponentType';

export const ShopButtonCommon = `
  width: fit-content;
`;

export const ShopNowButton = styled.span.attrs(props => ({
  className: classNames('stackend-shop-now stackend-button', props.className, props.theme?.shopifyApp ? 'button' : '')
}))`
  ${ShopButtonCommon};
  border: 0px;
  color: ${props => getComponentProp(props.theme, ComponentType.BUTTON, 'color')};
  background-color: ${props => props.theme.shopifyButtonColor};
  border-radius: ${props => props.theme.shopifyBorderRadius};

  &:hover {
    opacity: 0.9;
  }
}
`;

const productItemMargin = '1em 0;';

export const ProductTitlePart = styled.span.attrs(props => ({
  className: classNames('stackend-product-title', props.className)
}))``;
export const VariantTitlePart = styled.span.attrs(props => ({
  className: classNames('stackend-variant-title', props.className)
}))``;

export const Title = styled.h4.attrs(props => ({ className: classNames('stackend-product-name', props.className) }))`
  margin: ${productItemMargin};

  ${ProductTitlePart} {
    display: block;
  }

  ${VariantTitlePart} {
    display: block;
    font-size: 0.8em;
  }
`;

export const Sku = styled.div.attrs(props => ({ className: classNames('stackend-product-sku', props.className) }))``;
export const SkuLabel = styled.span.attrs(props => ({
  className: classNames('stackend-product-sku-label', props.className)
}))``;
export const SkuValue = styled.span.attrs(props => ({
  className: classNames('stackend-product-sku-value', props.className)
}))``;

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
  &.stackend-product-price-orig {
    text-decoration: line-through;
  }
  &.stackend-product-price-reduced {
    font-weight: bold;
  }
`;

export const Weight = styled.span.attrs(props => ({
  className: classNames('stackend-product-weight', props.className)
}))`
  display: none; /* not displayed by default */
`;

export const Tags = styled.div.attrs(props => ({ className: classNames('stackend-tags', props.className) }))`
  margin: ${productItemMargin};
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${props => props.theme.margins.small};
  a.stackend-tag {
    padding: ${props => props.theme.margins.small} ${props => props.theme.margins.medium};
    display: inline-block;
    text-decoration: none;
    background-color: ${props => props.theme?.color || '#000000'};
    color: ${props => props.theme?.backgroundColor || '#ffffff'};
    border-radius: ${props => props.theme?.borderRadius || '3px'};
  }
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
  ${ShopButtonCommon};
`;

export const ButtonPrevious = styled.button.attrs(props => ({
  className: classNames('stackend-button-previous', props.className)
}))`
  ${ShopButtonCommon};
`;
