//@flow
import React, { Component, MouseEvent } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import * as Sc from './ProductSubTypeListing.style';

import { ShopState } from '@stackend/api/shop/shopReducer';
import { ProductTypeTree, findProductTypeTreeNode, ProductTypeTreeNode } from '@stackend/api/shop/ProductTypeTree';

export type Props = {
  /**
   * Function used to create links to product type pages.
   */
  createProductTypeListingLink: (productType: string) => string;

  /**
   * Product type to list children of
   */
  productType: string;

  /**
   * Method invoked when a product type is clicked
   * @param e
   */
  onProductTypeClicked?: (e: MouseEvent, p: ProductTypeTreeNode) => void;
};

const mapDispatchToProps = {};

function mapStateToProps(state: any, ownProps: any): any {
  const shop: ShopState = state.shop;
  let productType = ownProps.productType;
  const n = findProductTypeTreeNode(shop.productTypeTree, productType);
  let subNodes: ProductTypeTree = n ? n.children : [];

  return {
    subNodes
  };
}

/**
 * Render a flat list of product types
 */
class ProductSubTypeTreeListing extends Component<Props> {
  render(): JSX.Element | null {
    const { subNodes } = this.props;

    if (!subNodes || subNodes.length === 0) {
      return null;
    }

    return <Sc.ProductSubTypeListing>{subNodes.map(p => this.renderProductType(p))}</Sc.ProductSubTypeListing>;
  }

  renderProductType(p: ProductTypeTreeNode): JSX.Element | null {
    if (p.productType === '') {
      return null;
    }

    const link = this.props.createProductTypeListingLink(p.productType);

    return (
      <li key={p.productType}>
        <Link to={link} onClick={(e: MouseEvent) => this.onProductTypeClicked(e, p)}>
          {p.name}
        </Link>
      </li>
    );
  }

  onProductTypeClicked = (e: MouseEvent, p: ProductTypeTreeNode) => {
    const { onProductTypeClicked } = this.props;
    if (onProductTypeClicked) {
      onProductTypeClicked(e, p);
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductSubTypeTreeListing);
