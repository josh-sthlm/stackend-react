//@flow
import React, { Component, Fragment, MouseEvent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import ProductListing, { Props as ProductListingProps } from './ProductListing';
import { getProductListingByKey, getProductListKey, requestProducts } from '@stackend/api/shop/shopActions';
import { ShopState, SlimProductListing } from '@stackend/api/shop/shopReducer';
import { ListProductsRequest, SlimProduct } from '@stackend/api/shop';
import ShopPagination from './ShopPagination';
import { ListingContext } from './ShopLinkFactory';

const mapDispatchToProps = {
  requestProducts,
  getProductListKey,
  getProductListingByKey
};

function mapStateToProps(
  state: any
): {
  shop: ShopState;
} {
  const shop: ShopState = state.shop;
  return {
    shop
  };
}

const connector = connect(mapStateToProps, mapDispatchToProps);

export interface Props extends ConnectedProps<typeof connector> {
  /**
   * Initial listing request
   */
  listProductsRequest: ListProductsRequest;

  /**
   * Should pagination be visible
   */
  showPagination?: boolean;

  /**
   * Show a placeholder?
   */
  showPlaceholder?: boolean;

  /**
   * Invoked when the pagination is clicked etc
   * @param newListProductsRequest
   * @param key
   */
  onListingRequestChanged?: (newListProductsRequest: ListProductsRequest, key: string) => void;

  /**
   * Invoked when the listing has been updated and new products are available
   */
  onProductListingUpdated?: (
    listProductsRequest: ListProductsRequest,
    key: string,
    listing: SlimProductListing | null
  ) => void;

  /**
   * Optional method to render the listing
   */
  renderListing?: (props: ProductListingProps) => JSX.Element | null;

  /**
   * Optional method to render a product
   */
  renderProduct?: ({ product, link }: { product: SlimProduct; link: string }) => JSX.Element;

  /**
   * Context of the listing
   * @param req
   */
  listingContext?: ListingContext;
}

type State = {
  key: string | null;
  fetching: boolean;
};

class ProductListingContainer extends Component<Props, State> {
  state = {
    key: null,
    fetching: false
  };

  componentDidMount(): void {
    this.requestProducts().then();
  }

  async componentDidUpdate(prevProps: Props): Promise<void> {
    if (!this.state.fetching) {
      const newKey = this.props.getProductListKey(this.props.listProductsRequest);
      if (newKey !== this.state.key) {
        await this.requestProducts();
      }
    }
  }

  render(): JSX.Element | null {
    const { showPlaceholder, showPagination, renderListing, renderProduct, listingContext } = this.props;
    const { key } = this.state;
    const listing = this.props.getProductListingByKey(key);
    const shop: ShopState = this.props.shop;
    const placeholders = showPlaceholder ? shop.defaults.pageSize : 0;

    const args: ProductListingProps = {
      products: listing?.products || [],
      placeholders,
      renderProduct
    };

    return (
      <Fragment>
        {renderListing ? renderListing(args) : this.defaultRenderListing(args)}
        {showPagination && (
          <ShopPagination
            listing={listing}
            onClick={this.onPaginationClicked}
            listingContext={listingContext || ListingContext.LISTING}
          />
        )}
      </Fragment>
    );
  }

  defaultRenderListing = (args: ProductListingProps): JSX.Element | null => {
    return <ProductListing {...args} />;
  };

  onPaginationClicked = (e: MouseEvent, req: ListProductsRequest): void => {
    if (this.props.onListingRequestChanged) {
      e.stopPropagation();
      e.preventDefault();
      const key = this.props.getProductListKey(req);
      this.props.onListingRequestChanged(req, key);
    }
  };

  requestProducts = async (): Promise<void> => {
    const { listProductsRequest } = this.props;
    const key = this.props.getProductListKey(listProductsRequest);
    const listing = this.props.getProductListingByKey(key);
    if (!listing) {
      this.setState({ key, fetching: true });
      await this.props.requestProducts(listProductsRequest);
    }

    // Switch the key when request completes
    this.setState({ key, fetching: false });

    if (this.props.onProductListingUpdated) {
      const listing = this.props.getProductListingByKey(key);
      this.props.onProductListingUpdated(listProductsRequest, key, listing);
    }
  };
}

export default connector(ProductListingContainer);
