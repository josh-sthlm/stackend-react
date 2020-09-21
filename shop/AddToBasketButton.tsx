import React, { Component } from 'react';
import { Product as ProductType } from '@stackend/api/shop';
import { addToBasket } from '@stackend/api/shop/shopActions';
import * as Sc from './Shop.style.js';
import { connect } from 'react-redux';

export interface Props {
  product: ProductType | null;
  addToBasket: (handle: string) => void;
}

const mapDispatchToProps = {
  addToBasket
};

function mapStateToProps(x: any, y: any) {
  return {};
}

class AddToBasketButton extends Component<Props> {
  render(): JSX.Element | null {
    return <Sc.AddToBasketButton onClick={this.onBuyClicked}>Lägg i korgen</Sc.AddToBasketButton>;
  }

  onBuyClicked = (): void => {
    const { product, addToBasket } = this.props;
    if (product) {
      addToBasket(product.handle);
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddToBasketButton);
