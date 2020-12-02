//@flow
import React, { Component, createRef, RefObject, ChangeEvent } from 'react';
import * as Sc from './ProductSearch.style';
import { getProductListingByKey, getProductListKey } from '@stackend/api/shop/shopActions';
import { connect } from 'react-redux';
import { ListProductsRequest, SlimProduct } from '@stackend/api/shop';
import ProductTypeSelect from './ProductTypeSelect';
import SortOptionsSelect from './SortOptionsSelect';
import ProductListingContainer from './ProductListingContainer';
import { injectIntl } from 'react-intl';

type State = {
  key: string | null;
  q: string;
  search: ListProductsRequest | null;
};

type Props = {
  /**
   * Initial search
   */
  listProductsRequest: ListProductsRequest | null;

  /**
   * Function used to create links to products
   */
  createProductLink: (product: SlimProduct) => string;

  /**
   * Function used to create previous/next links
   */
  createPaginationLink: (req: ListProductsRequest) => string;

  /**
   * Invoked when the search is changed
   */
  onListingRequestChanged: (search: ListProductsRequest, productListingKey: string) => void;
};

function mapStateToProps(state: any, ownProps: any) {
  return {
    shop: state.shop
  };
}

const mapDispatchToProps = {
  getProductListKey,
  getProductListingByKey
};

class ProductSearch extends Component<Props, State> {
  state: State = {
    key: null,
    q: '',
    search: null
  };

  searchInput: RefObject<HTMLInputElement> = createRef();

  static getDerivedStateFromProps(props: Props, state: State) {
    if (state.search === null && props.listProductsRequest) {
      return Object.assign({}, state, {
        search: props.listProductsRequest,
        q: props.listProductsRequest.q
      });
    }

    return state;
  }

  componentDidMount() {
    if (this.searchInput && this.searchInput.current) {
      this.searchInput.current.focus();
    }
  }

  render() {
    const { key, q, search } = this.state;
    const listing = key ? this.props.getProductListingByKey(key) : null;

    return (
      <Sc.ProductSearch>
        <Sc.ProductSearchForm onSubmit={this.onSearch} className="stackend-product-search-form">
          <div className="stackend-search-field">
            <input type="search" onChange={this.onSearchChanged} value={q || ''} ref={this.searchInput} />
            <button type="submit" className="stackend-is-icon large">
              {' '}
            </button>
          </div>
          {this.renderSearchOptions()}
        </Sc.ProductSearchForm>

        <ProductListingContainer
          listProductsRequest={search}
          createPaginationLink={this.props.createPaginationLink}
          createProductLink={this.props.createProductLink}
          showPagination={true}
          showPlaceholder={true}
          onListingRequestChanged={this.onListingRequestChanged}
        />
        {listing && listing.products.length === 0 && <Sc.NoMatches>Inga sökträffar</Sc.NoMatches>}
      </Sc.ProductSearch>
    );
  }

  renderSearchOptions() {
    const { productTypes, sort } = this.state.search;

    let productType = productTypes && productTypes.length !== 0 ? productTypes[0] : '';

    return (
      <Sc.SearchOptions>
        <label className="stackend-product-filters-label" htmlFor="stackend-product-filter">
          Kategori:{' '}
        </label>
        <ProductTypeSelect id="stackend-product-filter" onChange={this.onProductTypeChanged} value={productType} />
        <label htmlFor="stackend-product-sort" className="stackend-product-sort-label">
          Sortera efter:
        </label>
        <SortOptionsSelect
          size={1}
          id="stackend-product-sort"
          className="stackend-product-sort"
          onChange={this.onSortChanged}
          value={sort}
        />
      </Sc.SearchOptions>
    );
  }

  onProductTypeChanged = (e: ChangeEvent<HTMLSelectElement>, productType: string) => {
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

  onSortChanged = (e: ChangeEvent<HTMLSelectElement>) => {
    this.setState(
      {
        search: {
          ...this.state.search,
          sort: e.target.value,
          first: undefined,
          after: undefined,
          last: undefined,
          before: undefined
        }
      },
      this.updateSearch
    );
  };

  searchTimer: number = 0;

  onSearchChanged = (e: ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;

    // Immediately update the input field but delay the actual search
    this.setState({ q });
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(this.updateSearchPhrase, 500);
  };

  updateSearchPhrase = () => {
    let q = this.state.q;

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

  onSearch = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    // FIXME: direct to url
    return false;
  };

  onListingRequestChanged = (newListProductsRequest: ListProductsRequest, key: string) => {
    // Changed due to pagination
    this.setState({ search: newListProductsRequest }, this.updateSearch);
  };

  updateSearch = () => {
    const search = this.state.search as ListProductsRequest;
    let key = this.props.getProductListKey(search);
    this.setState({ key });
    if (this.props.onListingRequestChanged) this.props.onListingRequestChanged(search, key);
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ProductSearch));
