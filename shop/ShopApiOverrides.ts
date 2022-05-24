import { cartAdd, cartRemove, cartSetQuantity } from '@stackend/api/shop/shopActions';

type ShopApiOverrides = {
  cartAdd: typeof cartAdd | undefined;
  cartRemove: typeof cartRemove | undefined;
  cartSetQuantity: typeof cartSetQuantity | undefined;
};

/**
 * Typically used for hooking into stackend for making the shopify extension
 */
const SHOP_API_OVERRIDES: ShopApiOverrides = {
  cartAdd: undefined,
  cartRemove: undefined,
  cartSetQuantity: undefined
};

export default SHOP_API_OVERRIDES;
