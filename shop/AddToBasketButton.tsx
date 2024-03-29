//@flow
import React, { Component, MouseEvent } from 'react';
import { cartNotifyProductAdded, ModifyCartResult, Product as ProductType, ProductVariant } from '@stackend/api/shop';
import { cartAdd } from '@stackend/api/shop/shopActions';
import * as Sc from './AddToBasketButton.style';
import { connect, ConnectedProps } from 'react-redux';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import SHOP_API_OVERRIDES from './ShopApiOverrides';
import { ShopState } from '@stackend/api/shop/shopReducer';

interface State {
  saving: boolean;
}

const mapDispatchToProps = {
  cartAdd,
  cartNotifyProductAdded
};

function mapStateToProps(state: any): {
  enableCartNotifications: boolean;
} {
  const shop: ShopState = state.shop;
  const enableCartNotifications = shop.enableCartNotifications;
  return { enableCartNotifications };
}

const connector = connect(mapStateToProps, mapDispatchToProps);

export interface Props extends ConnectedProps<typeof connector>, WrappedComponentProps {
  product: ProductType | null;
  variant: ProductVariant | null;
  onClick?: (e: MouseEvent, product: ProductType, variant: ProductVariant) => void;
  enableCartNotifications: boolean;
}

class AddToBasketButton extends Component<Props, State> {
  state = {
    saving: false
  };

  render(): JSX.Element | null {
    const { variant, product } = this.props;

    if (!product) {
      return null;
    }

    const { saving } = this.state;

    return (
      <Sc.AddToBasketButton
        onClick={this.onBuyClicked}
        disabled={saving || !variant || !product.availableForSale || !variant.availableForSale}>
        <FormattedMessage id="shop.add_to_basket" defaultMessage="Add to cart" />
      </Sc.AddToBasketButton>
    );
  }

  onBuyClicked = (e: MouseEvent): void => {
    const { product, onClick, variant, cartAdd, cartNotifyProductAdded, enableCartNotifications } = this.props;
    if (product && variant) {
      (async (): Promise<void> => {
        this.setState({ saving: true });

        // Special check for external links as metafield in shopify
        if (product.metafield__stackendAddToCartLink) {
          window.open(product.metafield__stackendAddToCartLink.value, '_blank', 'noreferrer');
        } else {
          // Normal flow
          const r: ModifyCartResult = (await (SHOP_API_OVERRIDES.cartAdd || cartAdd)(
            product,
            variant
          )) as ModifyCartResult;
          //const r = await cartAdd(product, variant);

          if (!r.error && enableCartNotifications) {
            await cartNotifyProductAdded({ handle: product.handle, variantId: variant.id });
          }
        }

        if (onClick) {
          onClick(e, product, variant);
        }
        this.setState({ saving: false });
      })();
    }
  };
}

export default injectIntl(connector(AddToBasketButton));
