//@flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect, ConnectedProps } from 'react-redux';

import * as Sc from './ProductTypeCarousel.style';

import { ShopState } from '@stackend/api/shop/shopReducer';
import { generateClassName } from '@stackend/api/util';
import { getProductTypeLabel } from '@stackend/api/shop/shopActions';
import type { CarouselSettings } from './CarouselCommon';
import Slider from 'react-slick';
import { getProductTypeRoots } from '@stackend/api/shop';

const mapDispatchToProps = {};

function mapStateToProps(state: any, ownProps: any): any {
  const shop: ShopState = state.shop;
  return {
    productTypes: shop.productTypes
  };
}

const connector = connect(mapStateToProps, mapDispatchToProps);

export interface Props extends ConnectedProps<typeof connector> {
  /**
   * Product types
   */
  productTypes?: Array<string>;

  /**
   * Include only the top level items
   */
  topLevelProductTypesOnly?: boolean;

  /**
   * Function used to create links to product type pages.
   */
  createProductTypeListingLink: (productType: string) => string;

  /**
   * Method invoked when a product type is clicked
   * @param e
   */
  onProductTypeClicked?: (e: MouseEvent, p: string) => void;

  /**
   * Carousel settings
   */
  settings?: CarouselSettings;
}



export const DEFAULT_SETTINGS: CarouselSettings = {
  dots: false,
  arrows: true,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  rows: 1,
  autoPlay: true,
  centerMode: true,
  responsive: [
    {
      breakpoint: 1025,
      settings: {
        slidesToShow: 3
      }
    },
    {
      breakpoint: 720,
      settings: {
        slidesToShow: 2
      }
    },
    {
      breakpoint: 550,
      settings: {
        slidesToShow: 1
      }
    }
  ]
};

/**
 * Render a list of product types as a carousel
 */
class ProductTypeCarousel extends Component<Props> {
  static defaultProps = {
    onProductTypeClicked: (e: MouseEvent): void => {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  render(): JSX.Element | null {
    const { productTypes, settings } = this.props;

    if (!productTypes) {
      return null;
    }

    let pt = productTypes;
    if (this.props.topLevelProductTypesOnly) {
      pt = getProductTypeRoots(pt);
    }

    const s = Object.assign({}, DEFAULT_SETTINGS, settings || {}, {
      className: 'stackend-carousel'
    });

    return (
      <Sc.ProductTypeCarousel>
        <Slider {...s}>{pt.map(this.renderProductType)}</Slider>
      </Sc.ProductTypeCarousel>
    );
  }

  renderProductType = (productType: string): JSX.Element | null => {
    if (productType === '') {
      return null;
    }

    const className = 'stackend-product-type-carousel-item product-type-' + generateClassName(productType);
    const label = getProductTypeLabel(productType);
    const link = this.props.createProductTypeListingLink(productType);

    return (
      <div key={productType} className={className}>
        <Link to={link}>{label}</Link>
      </div>
    );
  };
}

export default connector(ProductTypeCarousel);
