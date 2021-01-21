import React, { Component } from 'react';
import ProductCollectionListingContainer, { RenderProps } from '../../shop/ProductCollectionListingContainer';
import ProductCarouselListing from '../../shop/ProductCarouselListing';
import ProductListing from '../../shop/ProductListing';

type Props = {
  handle: string;
  layout: 'slideshow' | 'list';
};

class ProductCollectionModule extends Component<Props> {
  render() {
    const { handle } = this.props;

    return (
      <ProductCollectionListingContainer
        handle={handle}
        showPlaceholder={true}
        showDescription={false}
        render={this.renderListing}
      />
    );
  }

  renderListing = (props: RenderProps): JSX.Element => {
    const { layout } = this.props;

    if (layout === 'slideshow') {
      return <ProductCarouselListing {...props} />;
    }

    return <ProductListing {...props} />;
  };
}
export default ProductCollectionModule;
