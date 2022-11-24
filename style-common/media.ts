/**
 * Media selectors
 */
export const media = {
  mobileScreen: '@media only screen and (max-width: 767px)',
  overMobile: '@media only screen and (min-width: 768px)',
  tabletScreen: '@media only screen and (max-width: 991px)',
  overTablet: '@media only screen and (min-width: 992px)',
  smallerScreen: '@media only screen and (max-width: 1300px)',
  largerScreen: '@media only screen and (min-width: 1300px)',
  evenLargerScreen: '@media only screen and (min-width: 1400px)',
  wideScreen1920: '@media only screen and (min-width: 1900px)',
  wideScreen2560: '@media only screen and (min-width: 2500px)',
  smallerThanEvenLargerScreen: '@media only screen and (max-width: 1399px)'
};

export default media;

/**
 * Container sizes matching the media selectors
 */
export const containerSize = {
  mobileScreen: 'max-width: 767px',
  overMobile: 'min-width: 768px',
  tabletScreen: 'max-width: 991px',
  overTablet: 'min-width: 992px',
  smallerScreen: 'max-width: 1300px',
  largerScreen: 'min-width: 1300px',
  evenLargerScreen: 'min-width: 1400px',
  wideScreen1920: 'min-width: 1900px',
  wideScreen2560: 'min-width: 2500px',
  smallerThanEvenLargerScreen: 'max-width: 1399px'
};

/**
 * Container selector
 */
export const container: { [size: string]: string } = {
  mobileScreen: '@container (max-width: 767px)',
  overMobile: '@container (min-width: 768px)',
  tabletScreen: '@container (max-width: 991px)',
  overTablet: '@container (min-width: 992px)',
  smallerScreen: '@container (max-width: 1300px)',
  largerScreen: '@container (min-width: 1300px)',
  evenLargerScreen: '@container (min-width: 1400px)',
  wideScreen1920: '@container (min-width: 1900px)',
  wideScreen2560: '@container (min-width: 2500px)',
  smallerThanEvenLargerScreen: '@container (max-width: 1399px)'
};
