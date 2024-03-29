//@flow
import React, { Component } from 'react';

import * as Sc from './ProductCarouselListing.style';
import { Props as ProductListingProps } from './ProductListing';
import { SlimProduct } from '@stackend/api/shop';
import ProductListingItem from './ProductListingItem';
import type { CarouselSettings } from './CarouselCommon';
import Slider from 'react-slick';
import { getLinkFactory } from '../link/LinkFactory';
import ShopLinkFactory from './ShopLinkFactory';
import { getCarouselDefaults } from './CarouselCommon';

export type Props = ProductListingProps & {
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

    const s = getCarouselDefaults(settings, DEFAULT_SETTINGS);
    const linkFactory = getLinkFactory<ShopLinkFactory>('shop');

    const x: any = s;
    return (
      <Sc.ProductCarouselListing>
        <Slider {...x}>{products.map(p => this.renderProduct(p, linkFactory))}</Slider>
      </Sc.ProductCarouselListing>
    );
  }

  renderProduct = (product: SlimProduct, linkFactory: ShopLinkFactory): JSX.Element | null => {
    if (!product) {
      return null;
    }

    const link = linkFactory.createProductLink(product);

    if (this.props.renderProduct) {
      return this.props.renderProduct({ product, link });
    }

    return <ProductListingItem product={product} link={link} key={product.id} />;
  };
}
