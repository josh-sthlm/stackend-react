//@flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ProductListing, { Props as ProductListingProps } from './ProductListing';
import { requestCollection } from '@stackend/api/shop/shopActions';
import { ShopState } from '@stackend/api/shop/shopReducer';
import { Collection, SlimProduct } from '@stackend/api/shop';
import { mapGraphQLList } from '@stackend/api/util/graphql';
import * as Sc from './ProductCollectionListingContainer.style';

export type RenderProps = ProductListingProps & {
  collection: Collection;
};

export type Props = {
  /**
   * Get the collection with this handle
   */
  handle: string;

  /**
   * Function invoked to create links to products
   * @param product
   */
  createProductLink: (product: SlimProduct) => string;

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
};

type State = {
  fetching: boolean;
};

const mapDispatchToProps = {
  requestCollection
};

function mapStateToProps(state: any, ownProps: any) {
  const shop: ShopState = state.shop;
  const collection = shop.collections[ownProps.handle];
  let products = mapGraphQLList(collection?.products, p => p);

  return {
    shop,
    collection,
    products
  };
}

class ProductCollectionListingContainer extends Component<Props, State> {
  state = {
    fetching: false
  };

  componentDidMount() {
    this.requestCollection().then();
  }

  async componentDidUpdate(prevProps: Props) {
    if (this.props.handle !== prevProps.handle) {
      await this.requestCollection();
    }
  }

  render() {
    const { showPlaceholder, createProductLink, shop, products, render, showDescription } = this.props;
    const placeholders = showPlaceholder ? shop.defaults.pageSize : 0;
    const collection: Collection | null = this.props.collection;

    if (!collection) {
      return null;
    }

    let r = render || this.defaultRender;
    let args = {
      collection,
      products,
      placeholders,
      createProductLink
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

  defaultRender = (args: RenderProps) => {
    return <ProductListing {...args} />;
  };

  requestCollection = async () => {
    const { handle, collection } = this.props;

    if (!collection && handle) {
      this.setState({ fetching: true });
      await this.props.requestCollection({ handle: handle });
    }

    // Switch the key when request completes
    this.setState({ fetching: false });
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductCollectionListingContainer);
