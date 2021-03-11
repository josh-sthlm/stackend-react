//@flow
import React, { Component, Fragment } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { findExactProductVariant, Product, ProductOption, ProductSelection, ProductVariant } from '@stackend/api/shop';
import * as Sc from './ProductVariantSelect.style';

type Props = {
  /**
   * Product
   */
  product: Product;

  /**
   * The selected options
   */
  selection: ProductSelection;

  /**
   * Callback invoked when the selection is changed
   */
  onSelectionChanged: (selection: ProductSelection, selectedVariant: ProductVariant | null) => void;
} & WrappedComponentProps &
  React.SelectHTMLAttributes<HTMLSelectElement>;

/**
 * Given a product, render a UI that allows the user to pick a specific product variant.
 */
class ProductVariantSelect extends Component<Props> {
  render(): JSX.Element | null {
    const { product, selection } = this.props;

    if (
      !product.options ||
      product.options.length === 0 ||
      (product.options.length === 1 && product.options[0].values.length === 1)
    ) {
      return null;
    }

    const s: ProductSelection = {};
    return (
      <Sc.ProductVariantSelect>
        {product.options.map((o, index) => {
          const value = selection[o.name] || o.values[0] || '';
          const isLast = index === product.options.length - 1;
          s[o.name] = value;
          return (
            <Fragment key={o.id}>
              <label htmlFor={o.id}>{o.name}:</label>
              <select
                size={1}
                key={o.id}
                id={o.id}
                value={value}
                onChange={(e): void => this.onVariantSelected(o, e.target.value)}>
                <option value="" key={o.id + '-label'} className="stackend-product-variant-label">
                  {o.name}
                </option>
                {o.values.map(v => {
                  let disabled = false;
                  let variant: ProductVariant | null = null;
                  if (isLast) {
                    const x = Object.assign({}, s, { [o.name]: v });
                    variant = findExactProductVariant(product, x);
                    disabled = !variant || !variant.availableForSale;
                  }
                  return (
                    <option disabled={disabled} value={v} key={v}>
                      {v}
                      {disabled
                        ? ' ' +
                          this.props.intl.formatMessage({ id: 'shop.product.sold_out', defaultMessage: '(Sold out)' })
                        : ''}
                    </option>
                  );
                })}
              </select>
            </Fragment>
          );
        })}
      </Sc.ProductVariantSelect>
    );
  }

  onVariantSelected = (option: ProductOption, value: string): void => {
    const { onSelectionChanged, selection, product } = this.props;
    const s = Object.assign({}, selection, {
      [option.name]: value
    });

    const selectedVariant = findExactProductVariant(product, s);

    if (onSelectionChanged) {
      onSelectionChanged(s, selectedVariant);
    }
  };
}

export default injectIntl(ProductVariantSelect);
