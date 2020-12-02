//@flow

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

      &.slick-next {
          right: 2em;
      }
      &.slick-prev {
          left: 2em;
      }

      &.slick-prev:before {
          font-size: 4rem;
      }
      &.slick-next:before {
        font-size: 4rem;
      }
    }
  }
`;
