import { SET_VISIBLE_PRODUCT, SET_VISIBLE_PRODUCT_IMAGE } from './shopUiReducer';
import type { Thunk } from '@stackend/api/api';
import { closeModal, openModal } from '../modal/modalActions';
import { requestProduct } from '@stackend/api/shop/shopActions';
import { ShopState } from '@stackend/api/shop/shopReducer';
import { ProductImage } from '@stackend/api/shop';

export const PRODUCT_MODAL_NAME = 'shop-product-modal';

/**
 * Open the product modal with a specific product selected
 * @param handle
 * @param variantId
 * @returns {(function(*, *): NodeJS.Global.Promise<void>)|*}
 */
export function openProductModal(handle: string, variantId: string): Thunk<Promise<void>> {
  return async (dispatch: any, getState) => {
    if (handle) {
      const shop: ShopState = getState().shop;
      if (!shop.products[handle]) {
        await dispatch(requestProduct({ handle }));
      }
    }

    dispatch({
      type: SET_VISIBLE_PRODUCT,
      handle,
      variantId
    });

    dispatch(openModal({ modalName: PRODUCT_MODAL_NAME }));
  };
}

/**
 * Close the product modal
 * @returns {(function(*): void)|*}
 */
export function closeProductModal(): Thunk<void> {
  return dispatch => {
    dispatch(closeModal({ modalName: PRODUCT_MODAL_NAME }));
    dispatch({
      type: SET_VISIBLE_PRODUCT,
      handle: null,
      variantId: null
    });
  };
}

/**
 * Set the visible product of the product modal
 * @param handle
 * @param variantId
 * @returns {(function(*): void)|*}
 */
export function setVisibleProduct(handle?: string, variantId?: string): Thunk<void> {
  return dispatch => {
    dispatch({
      type: SET_VISIBLE_PRODUCT,
      handle: handle || null,
      variantId: variantId || null
    });
  };
}

/**
 * Open the product image modal for a given product
 * @param image
 */
export function openProductImageModal(handle: string, image: ProductImage): Thunk<void> {
  return dispatch => {
    dispatch({
      type: SET_VISIBLE_PRODUCT_IMAGE,
      handle,
      image
    });
  };
}

export function closeProductImageModal(): Thunk<void> {
  return dispatch => {
    dispatch({
      type: SET_VISIBLE_PRODUCT_IMAGE,
      handle: null,
      image: null
    });
  };
}
