//@flow
import React, { ChangeEvent, Component, createRef, FormEvent, RefObject } from 'react';
import * as Sc from './ProductSearch.style';
import { getProductListingByKey, getProductListKey } from '@stackend/api/shop/shopActions';
import { connect, ConnectedProps } from 'react-redux';
import { ListProductsRequest, parseProductSortKey } from '@stackend/api/shop';
import ProductTypeSelect from './ProductTypeSelect';
import SortOptionsSelect from './SortOptionsSelect';
import ProductListingContainer from './ProductListingContainer';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { ListingContext } from './ShopLinkFactory';
import isEqual from 'lodash/isEqual';
import { ShopState } from '@stackend/api/shop/shopReducer';
import { newListProductsRequest } from '@stackend/api/shop';

function mapStateToProps(state: any): {
  shop: ShopState;
} {
  return {
    shop: state.shop
  };
}

const mapDispatchToProps = {
  getProductListKey,
  getProductListingByKey
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type State = {
  key: string | null;
  q: string;
  search: ListProductsRequest | null;
};

export interface Props extends ConnectedProps<typeof connector>, WrappedComponentProps {
  /**
   * Initial search
   */
  listProductsRequest: ListProductsRequest | null;

  /**
   * Invoked when the search is changed
   */
  onListingRequestChanged?: (search: ListProductsRequest, productListingKey: string) => void;
}

class ProductSearch extends Component<Props, State> {
  state: State = {
    key: null,
    q: '',
    search: null
  };

  searchInput: RefObject<HTMLInputElement> = createRef();

  static getDerivedStateFromProps(props: Props, state: State): State {
    if (props.listProductsRequest && state.search === null) {
      return Object.assign({}, state, {
        search: props.listProductsRequest || newListProductsRequest(),
        q: props.listProductsRequest.q
      });
    }

    return state;
  }

  componentDidMount(): void {
    if (this.searchInput && this.searchInput.current) {
      this.searchInput.current.focus();
    }
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    const { listProductsRequest } = this.props;
    if (!isEqual(listProductsRequest, prevProps.listProductsRequest)) {
      this.updateSearch();
    }
  }

  render(): JSX.Element | null {
    const { key, q, search } = this.state;
    const listing = key ? this.props.getProductListingByKey(key) : null;

    return (
      <Sc.ProductSearch>
        <Sc.ProductSearchForm onSubmit={this.onSearch} className="stackend-product-search-form">
          <div className="stackend-search-field">
            <input type="search" onChange={this.onSearchChanged} value={q || ''} ref={this.searchInput} />
            <button type="submit" className="stackend-icon large">
              {' '}
            </button>
          </div>
          {this.renderSearchOptions()}
        </Sc.ProductSearchForm>

        <ProductListingContainer
          listProductsRequest={search as ListProductsRequest}
          showPagination={true}
          showPlaceholder={true}
          onListingRequestChanged={this.onListingRequestChanged}
          listingContext={ListingContext.SEARCH}
        />
        {listing && listing.products.length === 0 && (
          <Sc.NoMatches>
            <FormattedMessage id="shop.search.no_hits" defaultMessage="No products matching the search" />
          </Sc.NoMatches>
        )}
      </Sc.ProductSearch>
    );
  }

  renderSearchOptions(): JSX.Element | null {
    const productTypes = this.state.search?.productTypes;
    const sort = this.state.search?.sort;

    const productType = productTypes && productTypes.length !== 0 ? productTypes[0] : '';

    return (
      <Sc.SearchOptions>
        <label className="stackend-product-filters-label" htmlFor="stackend-product-filter">
          <FormattedMessage id="shop.product_type" defaultMessage="Product type" />:{' '}
        </label>
        <ProductTypeSelect onChange={this.onProductTypeChanged} value={productType} />
        <label htmlFor="stackend-product-sort" className="stackend-product-sort-label">
          <FormattedMessage id="shop.sort_by" defaultMessage="Sort by" />:{' '}
        </label>
        <SortOptionsSelect id="stackend-product-sort" onChange={this.onSortChanged} value={sort} />
      </Sc.SearchOptions>
    );
  }

  onProductTypeChanged = (e: ChangeEvent<HTMLSelectElement>, productType: string): void => {
    this.setState(
      {
        search: {
          ...this.state.search,
          productTypes: productType ? [productType] : undefined,
          first: undefined,
          after: undefined,
          last: undefined,
          before: undefined
        }
      },
      this.updateSearch
    );
  };

  onSortChanged = (e: ChangeEvent<HTMLSelectElement>): void => {
    this.setState(
      {
        search: {
          ...this.state.search,
          sort: parseProductSortKey(e.target.value),
          first: undefined,
          after: undefined,
          last: undefined,
          before: undefined
        }
      },
      this.updateSearch
    );
  };

  searchTimer: any = 0;

  onSearchChanged = (e: ChangeEvent<HTMLInputElement>): void => {
    const q = e.target.value;

    // Immediately update the input field but delay the actual search
    this.setState({ q });
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(this.updateSearchPhrase, 500);
  };

  updateSearchPhrase = (): void => {
    const q = this.state.q;

    this.setState(
      {
        search: Object.assign({}, this.state.search, {
          q,
          tag: undefined,
          first: undefined,
          after: undefined,
          last: undefined,
          before: undefined
        })
      },
      this.updateSearch
    );
  };

  onSearch = (e: FormEvent): boolean => {
    e.preventDefault();
    e.stopPropagation();
    // FIXME: direct to url
    return false;
  };

  onListingRequestChanged = (newListProductsRequest: ListProductsRequest, _key: string): void => {
    // Changed due to pagination
    this.setState({ search: newListProductsRequest }, this.updateSearch);
  };

  updateSearch = (): void => {
    const search = this.state.search as ListProductsRequest;
    const key = this.props.getProductListKey(search);
    this.setState({ key });
    if (this.props.onListingRequestChanged) this.props.onListingRequestChanged(search, key);
  };
}

export default injectIntl(connector(ProductSearch));
