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
  render(): JSX.Element | null {
    const { listProductsRequest, layout } = this.props;
    if (!listProductsRequest) {
      return null;
    }

    const showPagination = layout === 'list';

    return (
      <ProductListingContainer
        listProductsRequest={listProductsRequest}
        showPagination={showPagination}
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
