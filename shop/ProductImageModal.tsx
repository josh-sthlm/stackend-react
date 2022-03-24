import React, { Component } from 'react';

import { connect, ConnectedProps } from 'react-redux';
import { Product, ProductImage } from '@stackend/api/shop';
import * as Sc from './ProductImageModal.style';
import { forEachGraphQLList } from '@stackend/api/util/graphql';
import ReactModal from 'react-modal';
import { ModalContent } from '../modal/Modal.style';
import { closeProductImageModal } from './shopUiActions';
import { ShopUiState } from './shopUiReducer';
import { ShopState } from '@stackend/api/shop/shopReducer';

function mapState({ shopUi, shop }: { shopUi: ShopUiState; shop: ShopState }): {
  product: Product | null;
  image: ProductImage | null;
  isOpen: boolean;
} {
  if (shopUi.productImageModal) {
    const product = shop.products[shopUi.productImageModal.handle] || null;
    if (product) {
      const image = shopUi.productImageModal.image;
      return {
        product,
        image,
        isOpen: !!image
      };
    }
  }

  return {
    product: null,
    image: null,
    isOpen: false
  };
}

const mapDispatch = {
  closeProductImageModal
};

const connector = connect(mapState, mapDispatch);

type Props = ConnectedProps<typeof connector>;

type State = {
  image: ProductImage | null;
  productId: string;
};

class ProductImageModal extends Component<Props, State> {
  state = {
    image: null,
    productId: ''
  };

  static getDerivedStateFromProps(props: Props, state: State): State {
    if ((!state.image && props.image) || props.product?.id !== state.productId) {
      return {
        image: props.image,
        productId: props.product?.id || ''
      };
    }
    return state;
  }

  render(): JSX.Element | null {
    const { product, isOpen } = this.props;
    if (!product) {
      return null;
    }

    const { image } = this.state;
    if (!image) {
      return null;
    }

    const i: ProductImage = image as any as ProductImage; // what is up with ts null check?
    // Not using Modal.tsx, since we need stacking
    return (
      <ReactModal
        isOpen={isOpen}
        className="stackend-product-image-modal stackend-modal-full-screen stackend-modal-not-scrolled"
        ariaHideApp={false}
        /* These class names are required for styled components and to avoid conflicts */
        portalClassName="stackend stackend-modal StackendModalPortal ReactModalPortal">
        <ModalContent>
          <Sc.ProductImageModal>
            <button className="stackend-close stackend-icon" onClick={this.onCloseClicked}>
              <i className="material-icons">close</i>
            </button>
            <button className="stackend-previous stackend-icon" onClick={this._onPrevClicked}>
              <i className="material-icons">navigate_before</i>
            </button>
            <button className="stackend-next stackend-icon" onClick={this._onNextClicked}>
              <i className="material-icons">navigate_next</i>
            </button>

            <img src={i.url__originalSrc || i.url} alt={i.altText || ''} />
          </Sc.ProductImageModal>
        </ModalContent>
      </ReactModal>
    );
  }

  _onPrevClicked = () => {
    const { product } = this.props;
    const { image } = this.state;
    if (!image || !product) {
      return;
    }
    const img = image as any as ProductImage;
    let prev: ProductImage | null = null;
    let found = false;
    forEachGraphQLList(product.images, i => {
      if (!found) {
        if (i.url === img.url) {
          found = true;
        } else {
          prev = i;
        }
      }
    });

    if (!prev) {
      // Wrap around
      prev = product.images.edges.length !== 0 ? product.images.edges[product.images.edges.length - 1].node : img;
    }

    this.setState({
      image: prev
    });
  };

  _onNextClicked = () => {
    const { product } = this.props;
    const { image } = this.state;
    if (!image || !product) {
      return;
    }

    const img = image as any as ProductImage;
    let next: ProductImage | null = null;
    let nextIsTarget = false;
    forEachGraphQLList(product.images, i => {
      if (nextIsTarget) {
        next = i;
        nextIsTarget = false;
      } else {
        if (i.url === img.url) {
          nextIsTarget = true;
        }
      }
    });

    if (!next) {
      // Wrap around
      next = product.images.edges.length !== 0 ? product.images.edges[0].node : img;
    }

    this.setState({
      image: next
    });
  };

  onCloseClicked = () => {
    const { closeProductImageModal } = this.props;
    closeProductImageModal();
  };
}

export default connector(ProductImageModal);
