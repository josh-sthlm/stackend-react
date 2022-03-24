import React, { Component } from 'react';
import Modal from '../modal/Modal';
import { closeModal } from '../modal/modalActions';
import { connect, ConnectedProps } from 'react-redux';
import { Product, ProductImage } from '@stackend/api/shop';
import * as Sc from './ProductImageModal.style';
import { forEachGraphQLList } from '@stackend/api/util/graphql';

function mapState() {
  return {};
}

const mapDispatch = {
  closeModal
};

const connector = connect(mapState, mapDispatch);

type Props = ConnectedProps<typeof connector> & {
  product: Product;
  image: ProductImage | null;
};

type State = {
  image: ProductImage | null;
};
export const PRODUCT_IMAGE_MODAL_NAME = 'product-image';

class ProductImageModal extends Component<Props, State> {
  state = {
    image: null
  };

  static getDerivedStateFromProps(props: Props, state: State): State {
    if (!state.image && props.image) {
      return {
        image: props.image
      };
    }
    return state;
  }

  render() {
    const { image } = this.state;
    if (!image) {
      return null;
    }

    return (
      <Modal modalName={PRODUCT_IMAGE_MODAL_NAME} className="stackend-product-image-modal stackend-modal-full-screen">
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

          <img src={image.url__originalSrc || image.url} alt={image.altText || ''} />
        </Sc.ProductImageModal>
      </Modal>
    );
  }

  _onPrevClicked = () => {
    const { product } = this.props;
    const { image } = this.state;
    if (!image) {
      return;
    }

    let prev: ProductImage = image;
    let found = false;
    forEachGraphQLList(product.images, i => {
      if (!found) {
        if (i.url === image.url) {
          found = true;
        } else {
          prev = i;
        }
      }
    });

    this.setState({
      image: prev
    });
  };

  _onNextClicked = () => {
    const { product } = this.props;
    const { image } = this.state;
    if (!image) {
      return;
    }

    let next: ProductImage = image;
    let nextIsTarget = false;
    forEachGraphQLList(product.images, i => {
      if (nextIsTarget) {
        next = i;
        nextIsTarget = false;
      } else {
        if (i.url === image.url) {
          nextIsTarget = true;
        }
      }
    });

    this.setState({
      image: next
    });
  };

  onCloseClicked = () => {
    const { closeModal } = this.props;
    closeModal({ modalName: PRODUCT_IMAGE_MODAL_NAME });
  };
}

export default connector(ProductImageModal);
