//@flow
import React, { Component, MouseEvent } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import * as Sc from './ProductTypeTreeListing.style';

import { ShopState } from '@stackend/api/shop/shopReducer';
import { ProductTypeTree, ProductTypeTreeNode } from '@stackend/api/shop/ProductTypeTree';
import { generateClassName } from '@stackend/api//util';
import type { ListProductsRequest } from '@stackend/api/shop';

export type Props = {
  /**
   * Function used to create links to product type pages.
   */
  createProductTypeListingLink: (req: ListProductsRequest | string) => string;

  /**
   * Should the tree
   */
  expandable?: boolean;

  /**
   * Should the entire tree be expanded?
   */
  expanded?: boolean;

  /**
   * Method invoked when a product type is clicked
   * @param e
   */
  onProductTypeClicked?: (e: MouseEvent, p: ProductTypeTreeNode) => void;

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
  static defaultProps = {
    expandable: true,
    expanded: false
  };

  state: State = {
    openProductTypes: {}
  };

  render(): JSX.Element | null {
    const { productTypesTree } = this.props;

    if (!productTypesTree) {
      return null;
    }

    return (
      <Sc.ProductTypeTreeListing className="stackend-product-tree-root">
        {productTypesTree.map(p => this.renderProductType(p))}
      </Sc.ProductTypeTreeListing>
    );
  }

  renderProductType(p: ProductTypeTreeNode): JSX.Element | null {
    if (p.productType === '') {
      return null;
    }

    const { expanded } = this.props;
    const hasChildren = p.children.length !== 0;
    const isOpen = expanded || this.state.openProductTypes[p.productType];
    const link = this.props.createProductTypeListingLink(p.productType);

    const className = 'product-type-' + generateClassName(p.productType);

    return (
      <li key={p.productType} className={className + (hasChildren ? ' has-children' : '') + (isOpen ? ' open' : '')}>
        <Link to={link} onClick={e => this.onProductTypeClicked(e, p)}>
          {p.name}
        </Link>
        {p.children.length !== 0 && (
          <Sc.ProductTypeTreeListing>{p.children.map(c => this.renderProductType(c))}</Sc.ProductTypeTreeListing>
        )}
      </li>
    );
  }

  onProductTypeClicked = (e: MouseEvent, p: ProductTypeTreeNode) => {
    const { onProductTypeClicked, expandable } = this.props;

    if (onProductTypeClicked) {
      onProductTypeClicked(e, p);
    }

    if (expandable && p.children.length) {
      const { openProductTypes } = this.state;

      let opt: { [productType: string]: boolean } = {};
      if (openProductTypes[p.productType]) {
        // Close this
        opt = { ...openProductTypes };
        closeTree(opt, p);
      } else {
        openTree(opt, p);
      }

      this.setState({
        openProductTypes
      });
    }
  };
}

function closeTree(openProductTypes: { [productType: string]: boolean }, p: ProductTypeTreeNode): void {
  delete openProductTypes[p.productType];
  for (let c of p.children) {
    closeTree(openProductTypes, c);
  }
}

function openTree(openProductTypes: { [productType: string]: boolean }, p: ProductTypeTreeNode): void {
  openProductTypes[p.productType] = true;
  let parent = getParentProductType(p.productType);
  while (parent) {
    openProductTypes[parent] = true;
    parent = getParentProductType(parent);
  }
}

function getParentProductType(productType: string): string | null {
  const i = productType.lastIndexOf('/');
  if (i === -1) {
    return null;
  }

  return productType.substring(0, i);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductTypeTreeListing);
