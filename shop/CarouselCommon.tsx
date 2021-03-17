//@flow
//import { JSX } from 'react';

import React from 'react';
import { DEFAULT_SETTINGS } from './ProductCarouselListing';

export interface CarouselResponsiveSettings {
  breakpoint: number;
  settings: {
    slidesToShow: number;
    slidesToScroll?: number;
  };
}

export interface CarouselSettings {
  dots?: boolean;
  arrows?: boolean;
  infinite?: boolean;
  speed?: number;
  slidesToShow?: number;
  slidesToScroll?: number;
  initialSlide?: number;
  rows?: number;
  autoPlay?: boolean;
  centerMode?: boolean;
  className?: string;
  responsive?: Array<CarouselResponsiveSettings>;
  prevArrow?: (props: ArrowProps) => JSX.Element;
  nextArrow?: (props: ArrowProps) => JSX.Element;
}

export interface ArrowProps {
  className?: string;
  style?: { [key: string]: string };
  onClick?: () => void;
}

/**
 * Custom previous arrow with material icons
 * @param props
 * @constructor
 */
export function ArrowPrev(props: ArrowProps): JSX.Element {
  const { className, style, onClick } = props;
  return (
    <div className={className} style={{ ...style }} onClick={onClick} role="button">
      <i className="material-icons">navigate_before</i>
    </div>
  );
}

/**
 * Custom next arrow with material icons
 * @param props
 * @constructor
 */
export function ArrowNext(props: ArrowProps): JSX.Element {
  const { className, style, onClick } = props;
  return (
    <div className={className} style={{ ...style }} onClick={onClick} role="button">
      <i className="material-icons">navigate_next</i>
    </div>
  );
}

//const ArrowPrevFactory = (p: ArrowProps): JSX.Element => <ArrowPrev {...p} />;
//ArrowPrevFactory.displayName = 'ArrowPrev';

//const ArrowNextFactory = (p: ArrowProps): JSX.Element => <ArrowNext {...p} />;
//ArrowNextFactory.displayName = 'ArrowNext';

/**
 * Get carousel default settings
 * @param settings
 * @param defaults
 */
export function getCarouselDefaults(
  settings: CarouselSettings | undefined,
  defaults?: CarouselSettings | undefined
): CarouselSettings {
  const s = Object.assign({}, DEFAULT_SETTINGS || {}, settings || {}, {
    className: 'stackend-carousel'
  });

  // The original arrows uses a custom font. We want material-icons
  if (!s.prevArrow) {
    s.prevArrow = ArrowPrev;
  }

  if (!s.nextArrow) {
    s.nextArrow = ArrowNext;
  }

  return s;
}

export const StackendCarouselStyle = `
  .slick-slider {
    .slick-slide > div {
      overflow: hidden;
      padding-right: 4px;
    }

    .slick-arrow {
      width: auto;
      height: auto;
      z-index: 10;
      text-shadow: 0 0 5px #222;
      color: black;
      background: white;
      border-radius: 50%;
      opacity: 50%;
      font-size: 4rem;

      &.slick-next {
        right: 1em;

      }
      &.slick-prev {
        left: 1em;
      }

      &.slick-prev:before {
        font-family: initial;
        content: '';
      }

      &.slick-next:before {
        font-family: initial;
        content: '';
      }
    }
  }
`;
