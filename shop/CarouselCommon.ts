//@flow
//import { JSX } from 'react';

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
  prevArrow?: JSX.Element;
  nextArrow?: JSX.Element;
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

      &.slick-next {
        right: 1em;
        font-size: 4rem;
      }
      &.slick-prev {
        left: 1em;
        font-size: 4rem;
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
