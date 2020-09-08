
import React, { Component } from 'react';
import { Product as ProductType } from '@stackend/api/shop';
import { addToBasket } from '@stackend/api/shop/shopActions';
import * as Sc from './Shop.style.js';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

export interface Props {
	product: ProductType | null,
	addToBasket: (product: ProductType) => any
}

function mapDispatchToProps(dispatch: Dispatch) {
	return {
		addToBasket: (props: any) => dispatch(addToBasket(props))
	};
}

function mapStateToProps(x: any, y: any) {}

class AddToBasketButton extends Component<Props> {
	render() {
		return <Sc.AddToBasketButton onClick={this.onBuyClicked}>Lägg i korgen</Sc.AddToBasketButton>;
	}

	onBuyClicked = (e: Event) => {
		const { product, addToBasket } = this.props;
		addToBasket(product);
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(AddToBasketButton);
