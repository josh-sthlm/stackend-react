//@flow
import React, { Component, MouseEvent } from 'react';
import { Product as ProductType, ProductVariant } from '@stackend/api/shop';
import { checkoutAdd } from '@stackend/api/shop/shopActions';
import * as Sc from './AddToBasketButton.style';
import { connect, ConnectedProps } from 'react-redux';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';

interface State {
  saving: boolean;
}

const mapDispatchToProps = {
  checkoutAdd
};

function mapStateToProps(x: any, y: any): any {
  return {};
}

const connector = connect(mapStateToProps, mapDispatchToProps);

export interface Props extends ConnectedProps<typeof connector>, WrappedComponentProps {
  product: ProductType | null;
  variant: ProductVariant | null;
  onClick: (e: MouseEvent, product: ProductType, variant: ProductVariant) => void;
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
    const { product, onClick, variant } = this.props;
    if (product && variant) {
      (async (): Promise<void> => {
        this.setState({ saving: true });
        this.props.checkoutAdd(product, variant);
        if (onClick) {
          onClick(e, product, variant);
        }
        this.setState({ saving: false });
      })();
    }
  };
}

export default injectIntl(connector(AddToBasketButton));
