//@flow
import React, { ChangeEvent, Component, Fragment } from 'react';
import { connect } from 'react-redux';

import * as Sc from './ProductTypeSelect.style';

import { ShopState } from '@stackend/api/shop/shopReducer';
import { ProductTypeTreeNode, ProductTypeTree } from '@stackend/api/shop/ProductTypeTree';
import { injectIntl, FormattedMessage } from 'react-intl';

export type Props = {
  value: string;

  /**
   * Method invoked when a product type is clicked
   * @param e
   */
  onChange?: (e: ChangeEvent<HTMLSelectElement>, productType: string) => void;

  productTypeTree?: ProductTypeTree;
};

const mapDispatchToProps = {};

function mapStateToProps(state: any, p: any): any {
  const shop: ShopState = state.shop;
  return {
    productTypeTree: shop.productTypeTree
  };
}

/**
 * Render a list of product types as a carousel
 */
class ProductTypeSelect extends Component<Props> {
  static defaultProps = {
    onChange: () => {}
  };

  render(): JSX.Element | null {
    const { productTypeTree, onChange, value } = this.props;

    if (!productTypeTree) {
      return null;
    }

    return (
      <Sc.ProductTypeSelect
        {...this.props}
        onChange={e => {
          if (onChange) onChange(e, e.target.value);
        }}
        value={value || ''}>
        <option value="" key="*">
          <FormattedMessage id="shop.productType.all" defaultMessage="All product types" />
        </option>
        {productTypeTree.map(t => this.renderProductType(t, 0))}
      </Sc.ProductTypeSelect>
    );
  }

  renderProductType = (n: ProductTypeTreeNode, depth: number): JSX.Element => {
    let indent = '';
    for (let i = 0; i < depth; i++) {
      indent += `\u00A0\u00A0\u00A0\u00A0`;
    }
    return (
      <Fragment key={'f-' + n.productType}>
        <option value={n.productType} key={n.productType}>
          {indent}
          {n.name}
        </option>
        {n.children.length !== 0 && n.children.map(t => this.renderProductType(t, depth + 1))}
      </Fragment>
    );
  };
}
export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ProductTypeSelect));
