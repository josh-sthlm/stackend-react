import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import * as Sc from './Shop.style';
import { templateReplaceUrl } from '@stackend/api/api';

import { ProductTypeTree, ProductTypeTreeNode, ShopState } from '@stackend/api/shop/shopReducer';

export type Props = {
  /**
   * Pattern used to create links to product type pages.
   * Use the @stackend/api/api/templateReplaceUrl pattern. For example:
   *
   * /category/{{productType}}
   *
   * Available values: productType
   */
  productTypeUrlPattern: string;

  productTypesTree?: ProductTypeTree;
};

type State = {
  openProductTypes: {
    [productType: string]: boolean;
  };
};

const mapDispatchToProps = {};

function mapStateToProps(state: any, ownProps: any): any {
  const shop: ShopState = state.shop;
  return {
    productTypesTree: shop.productTypeTree
  };
}

/**
 * Render a list of product types
 */
class ProductTypeTreeListing extends Component<Props, State> {
  state: State = {
    openProductTypes: {}
  };

  render(): JSX.Element | null {
    const { productTypesTree } = this.props;

    if (!productTypesTree) {
      return null;
    }

    return <Sc.ProductTypeListing>{productTypesTree.map(p => this.renderProductType(p))}</Sc.ProductTypeListing>;
  }

  renderProductType(p: ProductTypeTreeNode): JSX.Element | null {
    if (p.productType === '') {
      return null;
    }

    const link = templateReplaceUrl(this.props.productTypeUrlPattern, {
      productType: p.productType
    });

    const hasChildren = p.children.length !== 0;
    const isOpen = this.state.openProductTypes[p.productType];

    return (
      <li key={p.productType} className={(hasChildren ? 'has-children' : '') + (isOpen ? ' open' : '')}>
        {hasChildren ? (
          <Link to={link as string} onClick={() => this.onProductTypeClicked(p)}>
            {p.name}
          </Link>
        ) : (
          <Link to={link as string}>{p.name}</Link>
        )}
        {hasChildren && <Sc.ProductTypeListing>{p.children.map(c => this.renderProductType(c))}</Sc.ProductTypeListing>}
      </li>
    );
  }

  onProductTypeClicked = (p: ProductTypeTreeNode) => {
    const { openProductTypes } = this.state;

    let opt: { [productType: string]: boolean } = {};
    if (openProductTypes[p.productType]) {
      // Close this
      opt = { ...openProductTypes };
      delete opt[p.productType];
    } else {
      // Open this
      // FIXME: expand to root. close others
      opt[p.productType] = true;
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductTypeTreeListing);
