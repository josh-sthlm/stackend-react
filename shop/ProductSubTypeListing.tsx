//@flow
import React, { Component, MouseEvent } from 'react';
import { Link } from 'react-router';
import { connect, ConnectedProps } from 'react-redux';

import * as Sc from './ProductSubTypeListing.style';

import { ShopState } from '@stackend/api/shop/shopReducer';
import { ProductTypeTree, findProductTypeTreeNode, ProductTypeTreeNode } from '@stackend/api/shop/ProductTypeTree';

const mapDispatchToProps = {};

function mapStateToProps(state: any, ownProps: any): any {
  const shop: ShopState = state.shop;
  const productType = ownProps.productType;
  const n = findProductTypeTreeNode(shop.productTypeTree, productType);
  const subNodes: ProductTypeTree = n ? n.children : [];

  return {
    subNodes
  };
}

const connector = connect(mapStateToProps, mapDispatchToProps);

export interface Props extends ConnectedProps<typeof connector> {

  /**
   * Product type to list children of
   */
  productType: string;

  /**
   * Function used to create links to product type pages.
   */
  createProductTypeListingLink: (productType: string) => string;


  /**
   * Method invoked when a product type is clicked
   * @param e
   */
  onProductTypeClicked?: (e: MouseEvent, p: ProductTypeTreeNode) => void;
}


/**
 * Render a flat list of product types
 */
class ProductSubTypeTreeListing extends Component<Props> {
  render(): JSX.Element | null {
    const subNodes: ProductTypeTree = this.props.subNodes;

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
        <Link to={link} onClick={(e: MouseEvent): void => this.onProductTypeClicked(e, p)}>
          {p.name}
        </Link>
      </li>
    );
  }

  onProductTypeClicked = (e: MouseEvent, p: ProductTypeTreeNode): void => {
    const { onProductTypeClicked } = this.props;
    if (onProductTypeClicked) {
      onProductTypeClicked(e, p);
    }
  };
}

export default connector(ProductSubTypeTreeListing);
