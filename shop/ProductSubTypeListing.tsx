//@flow
import React, { Component, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';

import * as Sc from './ProductSubTypeListing.style';

import { ShopState } from '@stackend/api/shop/shopReducer';
import { ProductTypeTree, findProductTypeTreeNode, ProductTypeTreeNode } from '@stackend/api/shop/ProductTypeTree';
import ShopLinkFactory, { ListingContext } from './ShopLinkFactory';
import { getLinkFactory } from '../link/LinkFactory';

const mapDispatchToProps = {};

function mapStateToProps(state: any, ownProps: any) {
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

    const linkFactory = getLinkFactory<ShopLinkFactory>('shop');

    return (
      <Sc.ProductSubTypeListing>{subNodes.map(p => this.renderProductType(p, linkFactory))}</Sc.ProductSubTypeListing>
    );
  }

  renderProductType(p: ProductTypeTreeNode, linkFactory: ShopLinkFactory): JSX.Element | null {
    if (p.productType === '') {
      return null;
    }

    const link = linkFactory.createProductListingLink(p.productType, ListingContext.PRODUCT_TYPE_LISTING);

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
