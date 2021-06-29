import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ShopState } from '@stackend/api/shop/shopReducer';
import { requestProductTypes } from '@stackend/api/shop/shopActions';
import ProductTypeCarousel from '../../shop/ProductTypeCarousel';

function mapStateToProps(
  state: any
): {
  productTypes?: Array<string>;
} {
  const shop: ShopState = state.shop;
  const productTypes = shop.productTypes;

  return {
    productTypes
  };
}

const mapDispatchToProps = {
  requestProductTypes
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

class ProductTypeCarouseModule extends Component<Props> {
  componentDidMount(): void {
    const { productTypes, requestProductTypes } = this.props;
    if (!productTypes) {
      requestProductTypes({});
    }
  }

  render(): JSX.Element | null {
    //const { productTypes } = this.props;
    return (
      <ProductTypeCarousel
        onProductTypeClicked={(): void => {}}
        // FIXME: productTypes={productTypes}
        topLevelProductTypesOnly={true}
      />
    );
  }
}
export default connector(ProductTypeCarouseModule);
