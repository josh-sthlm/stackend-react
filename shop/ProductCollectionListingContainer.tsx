//@flow
import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import ProductListing, { Props as ProductListingProps } from './ProductListing';
import { requestCollection } from '@stackend/api/shop/shopActions';
import { ShopState } from '@stackend/api/shop/shopReducer';
import { Collection, SlimProduct } from '@stackend/api/shop';
import { mapGraphQLList } from '@stackend/api/util/graphql';
import * as Sc from './ProductCollectionListingContainer.style';

export type RenderProps = ProductListingProps & {
  collection: Collection;
};

const mapDispatchToProps = {
  requestCollection
};

function mapStateToProps(
  state: any,
  ownProps: any
): {
  shop: ShopState;
  collection: Collection;
  products: Array<SlimProduct>;
} {
  const shop: ShopState = state.shop;
  const collection = shop.collections[ownProps.handle];
  const products = mapGraphQLList(collection?.products, p => p);

  return {
    shop,
    collection,
    products
  };
}

const connector = connect(mapStateToProps, mapDispatchToProps);

export interface Props extends ConnectedProps<typeof connector> {
  /**
   * Get the collection with this handle
   */
  handle: string;

  /**
   * Show placeholders while loading
   */
  showPlaceholder?: boolean;

  /**
   * Should the description be visible?
   */
  showDescription?: boolean;

  /**
   * Optional render method
   * @param props
   */
  render?: (props: RenderProps) => JSX.Element | null;
}

type State = {
  fetching: boolean;
};

class ProductCollectionListingContainer extends Component<Props, State> {
  state = {
    fetching: false
  };

  componentDidMount(): void {
    this.requestCollection().then();
  }

  async componentDidUpdate(prevProps: Props): Promise<void> {
    if (this.props.handle !== prevProps.handle) {
      await this.requestCollection();
    }
  }

  render(): JSX.Element | null {
    const { showPlaceholder, shop, products, render, showDescription } = this.props;
    const placeholders = showPlaceholder ? shop.defaults.pageSize : 0;
    const collection: Collection | null = this.props.collection;

    if (!collection) {
      return null;
    }

    const r = render || this.defaultRender;
    const args = {
      collection,
      products,
      placeholders
    };

    return (
      <Sc.ProductCollectionListingContainer>
        {showDescription && (
          <Sc.ProductCollectionDescription>
            <h1>{args.collection.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: args.collection.descriptionHtml }} />
          </Sc.ProductCollectionDescription>
        )}
        {r(args)}
      </Sc.ProductCollectionListingContainer>
    );
  }

  defaultRender = (args: RenderProps): JSX.Element | null => {
    return <ProductListing {...args} />;
  };

  requestCollection = async (): Promise<void> => {
    const { handle, collection } = this.props;

    if (!collection && handle) {
      this.setState({ fetching: true });
      await this.props.requestCollection({ handle: handle });
    }

    // Switch the key when request completes
    this.setState({ fetching: false });
  };
}

export default connector(ProductCollectionListingContainer);
