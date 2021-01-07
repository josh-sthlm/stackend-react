//@flow
import React, { Component } from 'react';

import * as Sc from './ProductCarouselListing.style';
import { Props as ProductListingProps } from './ProductListing';
import { SlimProduct } from '@stackend/api/shop';
import ProductListingItem from './ProductListingItem';
import type { CarouselSettings } from './CarouselCommon';
import Slider from 'react-slick';

export type Props = ProductListingProps & {
  /**
   * Function invoked to create links to products
   * @param product
   */
  createProductLink: (product: SlimProduct) => string;

  /**
   * Optional method to render a product
   */
  renderProduct?: ({ product, link }: { product: SlimProduct; link: string }) => JSX.Element;

  /**
   * Settings for the carousel
   */
  settings?: CarouselSettings;
};

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
export default class ProductCarouselListing extends Component<Props> {
  render(): JSX.Element | null {
    const { products, settings } = this.props;

    if (!products) {
      return null;
    }

    const s = Object.assign({}, DEFAULT_SETTINGS, settings || {}, {
      className: 'stackend-carousel'
    });

    // The original arrows uses a custom font. We want material-icons
    if (!s.prevArrow) {
      s.prevArrow = <i className="material-icons">navigate_before</i>;
    }

    if (!s.nextArrow) {
      s.nextArrow = <i className="material-icons">navigate_next</i>;
    }

    return (
      <Sc.ProductCarouselListing>
        <Slider {...s}>{products.map(this.renderProduct)}</Slider>
      </Sc.ProductCarouselListing>
    );
  }

  renderProduct = (product: SlimProduct): JSX.Element | null => {
    if (!product) {
      return null;
    }

    const link = this.props.createProductLink(product);

    if (this.props.renderProduct) {
      return this.props.renderProduct({ product, link });
    }

    return <ProductListingItem product={product} link={link} key={product.id} />;
  };
}
