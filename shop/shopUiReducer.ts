import { AnyAction } from 'redux';
import { ProductImage } from '@stackend/api/shop';

export type ShopUiState = {
  visibleProduct: null | {
    handle: string;
    variantId: string | null;
  };

  productImageModal: null | {
    handle: string;
    image: ProductImage;
  };
};

export const SET_VISIBLE_PRODUCT = 'SET_VISIBLE_PRODUCT';
export const SET_VISIBLE_PRODUCT_IMAGE = 'SET_VISIBLE_PRODUCT_IMAGE';

type ShopUiActions =
  | (AnyAction & {
      type: typeof SET_VISIBLE_PRODUCT;
      handle: string | null;
      variantId: string | null;
    })
  | (AnyAction & {
      type: typeof SET_VISIBLE_PRODUCT_IMAGE;
      handle: string | null;
      image: ProductImage | null;
    });

/**
 * keeps track of the currently selected product
 * @param state
 * @param action
 * @returns {{visibleProduct: null}|{visibleProduct: {handle: string, variantId: (string|null)}}|ShopUiState}
 */
export function shopUi(
  state: ShopUiState = { visibleProduct: null, productImageModal: null },
  action: ShopUiActions
): ShopUiState {
  switch (action.type) {
    case SET_VISIBLE_PRODUCT: {
      if (action.handle) {
        return {
          visibleProduct: {
            handle: action.handle,
            variantId: action.variantId || null
          },
          productImageModal: null
        };
      } else {
        return { visibleProduct: null, productImageModal: null };
      }
    }
    case SET_VISIBLE_PRODUCT_IMAGE: {
      return Object.assign({}, state, {
        productImageModal:
          action.image && action.handle
            ? {
                handle: action.handle,
                image: action.image
              }
            : null
      });
    }
  }

  return state;
}

export default shopUi;
