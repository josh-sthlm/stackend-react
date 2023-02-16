//@flow
import React, { Component } from 'react';
import * as Sc from './Product.style';
import {
  getFirstImage,
  getProductSelection,
  getProductVariant,
  MoneyV2,
  Product as IProduct,
  ProductImage,
  ProductSelection,
  ProductVariant
} from '@stackend/api/shop';
import AddToBasketButton from './AddToBasketButton';
import { getPriceIncludingVAT } from '@stackend/api/shop/vat';
import { Description, Title } from './Shop.style';
import Price, { Type } from './Price';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import ProductVariantSelect from './ProductVariantSelect';
import ProductImageBrowser from './ProductImageBrowser';
import ProductTags from './ProductTags';
import Sku from './Sku';
import { ShopState } from '@stackend/api/shop/shopReducer';
import { connect, ConnectedProps } from 'react-redux';
import Weight from './Weight';

function mapStateToProps(state: any): {
  shop: ShopState;
} {
  return {
    shop: state.shop
  };
}

const connector = connect(mapStateToProps);

export interface Props extends WrappedComponentProps, ConnectedProps<typeof connector> {
  /**
   * Product
   */
  product: IProduct;

  /**
   * Callback when user selects a variant
   * @param e
   * @param variant
   * @param product
   */
  onVariantSelected?: (variant: ProductVariant | null, product: IProduct) => void;

  /**
   * Supply the id of the initially selected product variant
   */
  initialProductVariantId?: string;
}

type State = {
  selectedVariant: ProductVariant | null;
  selection: ProductSelection;
  selectedImage: ProductImage | null;
};

/**
 * Renders a product
 */
class Product extends Component<Props, State> {
  state: State = {
    selectedVariant: null,
    selection: {},
    selectedImage: null
  };

  static getDerivedStateFromProps(props: Props, state: State): any {
    if (state.selectedVariant == null && props.initialProductVariantId) {
      const selectedVariant = getProductVariant(props.product, props.initialProductVariantId);
      const selection = getProductSelection(props.product, selectedVariant);
      const selectedImage =
        selectedVariant && selectedVariant.image ? selectedVariant.image : getFirstImage(props.product);
      return {
        selectedVariant,
        selection,
        selectedImage
      };
    }

    return state;
  }

  componentDidMount(): void {
    const { product } = this.props;
    if (product) {
      const { selectedVariant, selectedImage, selection } = this.state;
      this.updatedSelectedVariant(selectedVariant, selection, selectedImage);
    }
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    const { product } = this.props;
    if (prevProps.product && product && prevProps.product.handle !== product.handle) {
      this.updatedSelectedVariant(null, {}, null);
    }
  }

  updatedSelectedVariant = (
    selectedVariant: ProductVariant | null,
    selection: ProductSelection,
    selectedImage: ProductImage | null
  ): void => {
    // Select first variant
    const { product } = this.props;
    if (!selectedVariant) {
      if (product.variants && product.variants.edges.length !== 0) {
        selectedVariant = product.variants.edges[0].node;
        selection = getProductSelection(product, selectedVariant);
      }
      if (!selectedImage) {
        selectedImage = getFirstImage(product) as ProductImage;
      }
    } else {
      // Select first image, unless a variant is selected
      selectedImage = selectedVariant.image || (getFirstImage(product) as ProductImage);
    }

    this.setState({
      selectedVariant,
      selection,
      selectedImage
    });
  };

  render(): JSX.Element | null {
    const { product, shop } = this.props;
    const { selectedVariant, selectedImage, selection } = this.state;

    if (!product) {
      return null;
    }

    const price = getPriceIncludingVAT({ shopState: shop, product, productVariant: selectedVariant });

    // Original price, if reduced
    let compareAtPrice: MoneyV2 | null = null;
    if (selectedVariant && selectedVariant.compareAtPrice) {
      compareAtPrice = getPriceIncludingVAT({
        shopState: shop,
        product,
        productVariant: selectedVariant,
        price: selectedVariant.compareAtPrice
      });
    }

    return (
      <Sc.Product>
        <Title>{product.title}</Title>
        <Sku variant={selectedVariant} />
        <Sc.ProductDetails>
          <ProductImageBrowser product={product} selectedImage={selectedImage} onImageSelected={this.onImageSelected} />
          <Title>{product.title}</Title>
        </Sc.ProductDetails>

        <Sc.Actions>
          <ProductVariantSelect product={product} selection={selection} onSelectionChanged={this.onVariantSelected} />
          <Sc.Prices>
            {compareAtPrice ? (
              <>
                <Price price={price} type={Type.REDUCED} />
                <Price price={compareAtPrice} type={Type.ORIGINAL} />
              </>
            ) : (
              <Price price={price} />
            )}
          </Sc.Prices>
          <Weight variant={selectedVariant} />
          <Sku variant={selectedVariant} />
          <AddToBasketButton product={product} variant={selectedVariant} />
          <ProductTags product={product} />
        </Sc.Actions>

        <Description dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
      </Sc.Product>
    );
  }

  onVariantSelected = (selection: ProductSelection, selectedVariant: ProductVariant | null): void => {
    const { onVariantSelected, product } = this.props;
    const { selectedImage } = this.state;
    const img = selectedVariant && selectedVariant.image ? selectedVariant.image : selectedImage;

    this.setState(
      {
        selection,
        selectedVariant,
        selectedImage: img
      },
      () => {
        if (onVariantSelected) onVariantSelected(selectedVariant, product);
      }
    );
  };

  onImageSelected = (
    product: IProduct,
    image: ProductImage,
    productVariant: ProductVariant | null,
    selection: ProductSelection | null
  ): void => {
    this.setState({
      selectedImage: image,
      selectedVariant: productVariant,
      selection: selection || {}
    });
  };
}

export default connector(injectIntl(Product));
