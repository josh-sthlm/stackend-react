//@flow
import React, { Component, MouseEvent } from 'react';
import { cartNotifyProductAdded, ModifyCartResult, Product as ProductType, ProductVariant } from '@stackend/api/shop';
import { cartAdd } from '@stackend/api/shop/shopActions';
import * as Sc from './AddToBasketButton.style';
import { connect, ConnectedProps } from 'react-redux';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import SHOP_API_OVERRIDES from './ShopApiOverrides';

interface State {
  saving: boolean;
}

const mapDispatchToProps = {
  cartAdd,
  cartNotifyProductAdded
};

function mapStateToProps(_x: any) {
  return {};
}

const connector = connect(mapStateToProps, mapDispatchToProps);

export interface Props extends ConnectedProps<typeof connector>, WrappedComponentProps {
  product: ProductType | null;
  variant: ProductVariant | null;
  onClick?: (e: MouseEvent, product: ProductType, variant: ProductVariant) => void;
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
        <FormattedMessage id="shop.add_to_basket" defaultMessage="Add to basket" />
      </Sc.AddToBasketButton>
    );
  }

  onBuyClicked = (e: MouseEvent): void => {
    const { product, onClick, variant, cartAdd, cartNotifyProductAdded } = this.props;
    if (product && variant) {
      (async (): Promise<void> => {
        this.setState({ saving: true });

        const r: ModifyCartResult = (await (SHOP_API_OVERRIDES.cartAdd || cartAdd)(
          product,
          variant
        )) as ModifyCartResult;
        //const r = await cartAdd(product, variant);
        if (!r.error) {
          await cartNotifyProductAdded({ handle: product.handle, variantId: variant.id });
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
