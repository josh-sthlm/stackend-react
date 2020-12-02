//@flow
import React, { Component, Fragment, MouseEvent } from 'react';
import * as Sc from './Product.style';
import {
  getFirstImage,
  getProductVariant,
  Product as IProduct,
  ProductOption,
  ProductVariant,
  getAllUniqueImages,
  findExactProductVariant,
  getProductSelection,
  ProductSelection
} from '@stackend/api/shop';
import AddToBasketButton from './AddToBasketButton';
import { ProductImage } from '@stackend/api/shop';
import { Link } from 'react-router';
import { Description, Tags, Title } from './Shop.style';
import Price from './Price';
import { FormattedMessage, injectIntl } from 'react-intl';

export interface Props {
  /**
   * Product
   */
  product: IProduct;

  /**
   * Function used to create links to tag searches
   */
  createProductTagSearchLink: (tag: string, product: IProduct) => string;

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

  static getDerivedStateFromProps(props: Props, state: State) {
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

  componentDidMount() {
    const { product } = this.props;
    let { selectedVariant, selectedImage, selection } = this.state;

    if (product) {
      // Select first variant
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
    }
  }

  render(): JSX.Element | null {
    const { product } = this.props;
    const { selectedVariant, selectedImage } = this.state;

    if (!product) {
      return null;
    }

    let image = selectedImage;
    let price = selectedVariant ? selectedVariant.priceV2 : null;

    return (
      <Sc.Product>
        <Title>{product.title}</Title>
        <Sc.ProductDetails>
          <Sc.ProductImageBrowser>
            {image && (
              <Link to={image.originalSrc} target="_blank">
                {this.renderImage(image, false)}
              </Link>
            )}
            {this.renderProductImageThumbnails()}
          </Sc.ProductImageBrowser>

          <Title>{product.title}</Title>
        </Sc.ProductDetails>

        <Sc.Actions>
          {this.renderOptions(product)}
          <Price price={price} />
          <AddToBasketButton product={product} variant={selectedVariant} />
          {product.tags && <Tags>{product.tags.map(this.renderTag)}</Tags>}
        </Sc.Actions>

        <Description dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
      </Sc.Product>
    );
  }

  renderProductImageThumbnails = (): JSX.Element | null => {
    const { product } = this.props;
    const images: Array<ProductImage> = getAllUniqueImages(product);

    return images.length > 1 ? (
      <Sc.ProductImageBrowserThumbnails>{images.map(this.renderThumbnail)}</Sc.ProductImageBrowserThumbnails>
    ) : null;
  };

  renderThumbnail = (image: ProductImage) => {
    const { selectedImage } = this.state;
    return (
      <li key={image.transformedSrc} className={selectedImage === image ? 'selected' : ''}>
        <button onClick={e => this.onThumbnailClicked(e, image)}>{this.renderImage(image, false)}</button>
      </li>
    );
  };

  renderImage = (image: ProductImage, draggable: boolean): JSX.Element => {
    if (typeof draggable === 'undefined' || draggable) {
      return <img src={image.transformedSrc} alt={image.altText || ''} />;
    } else {
      return <img src={image.transformedSrc} alt={image.altText || ''} draggable={false} />;
    }
  };

  renderOptions = (product: IProduct): JSX.Element | null => {
    if (
      !product.options ||
      product.options.length === 0 ||
      (product.options.length === 1 && product.options[0].values.length === 1)
    ) {
      return null;
    }

    const { selection } = this.state;

    let s: ProductSelection = {};
    return (
      <Sc.ProductOptions>
        {product.options.map((o, index) => {
          const value = selection[o.name] || o.values[0] || '';
          const isLast = index === product.options.length - 1;
          s[o.name] = value;
          return (
            <Fragment key={o.id}>
              <label htmlFor={o.id}>{o.name}:</label>
              <select
                size={1}
                key={o.id}
                id={o.id}
                value={value}
                onChange={e => this.onVariantSelected(o, e.target.value)}>
                {o.values.map(v => {
                  let disabled = false;
                  let variant: ProductVariant | null = null;
                  if (isLast) {
                    const x = Object.assign({}, s, { [o.name]: v });
                    variant = findExactProductVariant(product, x);
                    disabled = !variant || !variant.availableForSale;
                  }
                  return (
                    <option disabled={disabled} value={v} key={v}>
                      {v}
                      {disabled && <FormattedMessage id="shop.product.sold_out" defaultMessage="(Sold out)"/> }
                    </option>
                  );
                })}
              </select>
            </Fragment>
          );
        })}
      </Sc.ProductOptions>
    );
  };

  renderTag = (t: string): JSX.Element => {
    const link = this.props.createProductTagSearchLink(t, this.props.product);
    return (
      <Fragment key={t}>
        <Link to={link} className="stackend-tag">
          {t}
        </Link>{' '}
      </Fragment>
    );
  };

  onVariantSelected = (option: ProductOption, value: string) => {
    const { onVariantSelected, product } = this.props;

    const selection = Object.assign({}, this.state.selection, {
      [option.name]: value
    });

    const selectedVariant = findExactProductVariant(this.props.product, selection);
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

  onThumbnailClicked = (e: MouseEvent, image: ProductImage) => {
    const { product } = this.props;
    let { selection, selectedVariant } = this.state;
    let s = findProductVariantByImage(product, image);
    if (s) {
      selectedVariant = s;
      selection = getProductSelection(product, selectedVariant);
    }

    this.setState({
      selectedImage: image,
      selectedVariant,
      selection
    });
  };
}

export default injectIntl(Product);

/**
 * Find a product variant given an image
 * @param product
 * @param image
 */
export function findProductVariantByImage(product: IProduct, image: ProductImage): ProductVariant | null {
  if (!product || !image) {
    return null;
  }

  let x = product.variants.edges.find(v => {
    return v.node?.image?.transformedSrc === image.transformedSrc;
  });

  return x ? x.node : null;
}
