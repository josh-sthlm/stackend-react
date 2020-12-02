//@flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import * as Sc from './ProductTypeCarousel.style';

import { ShopState } from '@stackend/api/shop/shopReducer';
import { generateClassName } from '@stackend/api/util';
import { getProductTypeLabel } from '@stackend/api/shop/shopActions';
import type { CarouselSettings } from './CarouselCommon';
import Slider from 'react-slick';

export type Props = {
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
};

const mapDispatchToProps = {};

function mapStateToProps(state: any, ownProps: any): any {
  const shop: ShopState = state.shop;
  return {
    productTypes: shop.productTypes
  };
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
    onProductTypeClicked: (e: MouseEvent) => {
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
      pt = getRoots(pt);
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductTypeCarousel);

function getRoots(productTypes: Array<string>): Array<string> {
  let x: Set<string> = new Set();
  productTypes.forEach(p => {
    if (p === '') {
      return;
    }
    let v: string = p;
    let i = v.indexOf('/');
    if (i === -1) {
      x.add(v);
    } else {
      x.add(v.substring(0, i));
    }
  });

  return Array.from(x);
}