
import React, { Component } from 'react';
import { Product as ProductType } from '@stackend/api/shop';
import { addToBasket } from '@stackend/api/shop/shopActions';
import * as Sc from './Shop.style.js';
import { connect } from 'react-redux';

export interface Props {
	product: ProductType | null,
	addToBasket: (product: ProductType) => any
}

const mapDispatchToProps = {
		addToBasket
}

function mapStateToProps(x: any, y: any) {
  return {}
}

class AddToBasketButton extends Component<Props> {
	render() {
		return <Sc.AddToBasketButton onClick={this.onBuyClicked}>Lägg i korgen</Sc.AddToBasketButton>;
	}

	onBuyClicked = () => {
		const { product, addToBasket } = this.props;
		if (product) {
      addToBasket(product);
    }
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(AddToBasketButton);