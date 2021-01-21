import React, { Component } from 'react';
import ProductListingContainer from '../../shop/ProductListingContainer';
import { ListProductsRequest } from '@stackend/api/shop';
import ProductCarouselListing from '../../shop/ProductCarouselListing';
import ProductListing, { Props as ProductListingProps } from '../../shop/ProductListing';

type Props = {
  listProductsRequest: ListProductsRequest;
  layout: 'slideshow' | 'list';
};

class ProductListingModule extends Component<Props> {
  render() {
    const { listProductsRequest } = this.props;
    if (!listProductsRequest) {
      return null;
    }

    return (
      <ProductListingContainer
        listProductsRequest={listProductsRequest}
        showPagination={true}
        showPlaceholder={true}
        renderListing={this.renderListing}
      />
    );
  }

  renderListing = (props: ProductListingProps): JSX.Element => {
    const { layout } = this.props;

    if (layout === 'slideshow') {
      return <ProductCarouselListing {...props} />;
    }

    return <ProductListing {...props} />;
  };
}
export default ProductListingModule;
