import React, { Component, MouseEvent } from 'react';
import { Basket, Product as ProductType } from '@stackend/api/shop';
import { getBasket, storeBasket } from '@stackend/api/shop/shopActions';
import * as Sc from './Shop.style.js';
import { connect } from 'react-redux';

export interface Props {
  product: ProductType | null;
  onClick: (e: MouseEvent, p: ProductType) => void;
  getBasket: () => Basket;
  storeBasket: (basket: Basket) => void;
}

const mapDispatchToProps = {
  getBasket,
  storeBasket
};

function mapStateToProps(x: any, y: any) {
  return {};
}

class AddToBasketButton extends Component<Props> {
  render(): JSX.Element | null {
    return <Sc.AddToBasketButton onClick={this.onBuyClicked}>Lägg i korgen</Sc.AddToBasketButton>;
  }

  onBuyClicked = (e: MouseEvent): void => {
    const { product, getBasket, storeBasket, onClick } = this.props;
    if (product) {
      const basket = getBasket();
      basket.add(product.handle);
      storeBasket(basket);
      if (onClick) {
        onClick(e, product);
      }
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddToBasketButton);
