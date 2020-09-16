import get from 'lodash/get';
export const BigDesktop = '@media screen and (min-width: 1300px)';
export const Tablet = '@media screen and (min-width: 767px) and (max-width: 991px)';
export const TabletAndMobile = '@media screen and (max-width: 991px)';
export const Mobile = '@media screen and (max-width: 767px)';

export const boxShadow = '2px 2px 20px rgba(70, 70, 70, 0.5)';

export const borderColor = (props: any) => get(props, 'theme.settings.borderColor', 'rgba(0, 0, 0, .15)');

export const sendBorderColor = (props: any) => get(props, 'theme.settings.sendBorderColor', '#00B2E8');

export const border = (props: any) => `1px solid ${borderColor(props)}`;
export const borderRadius = '3px';

export const maxContentWidthDesktop = '960px';
export const maxContentWidthLargeDesktop = '1120px';
export const maxContentBlogWidth = '790px';

// Text
export const colorTitle = (props: any) =>
  get(props, 'theme.style.colorTitle', get(props, 'theme.settings.colorTitle', '#565656'));
export const colorText = (props: any) =>
  get(props, 'theme.style.colorText', get(props, 'theme.settings.colorText', '#565656'));

export const colorLight = (props: any) =>
  get(props, 'theme.style.discreteColor', get(props, 'theme.settings.colorLight', '#a2a2a2'));
export const colorTextInverted = (props: any) => get(props, 'theme.settings.colorTextInverted', '#ffffff');
export const colorTextListed = (props: any) => get(props, 'theme.settings.colorTextListed', '#383838');
export const colorTextAccent = (props: any) =>
  get(props, 'theme.style.accentColor', get(props, 'theme.settings.colorTextAccent', '#00B2E8'));

export const backgroundColor = (props: any) =>
  get(props, 'theme.style.backgroundColor', get(props, 'theme.settings.backgroundColor', '#ffffff'));

export const discreteBackgroundColor = (props: any) =>
  get(props, 'theme.style.discreteBackgroundColor', get(props, 'theme.settings.discreteBackgroundColor', '#B1B1B1'));

// Fonts
export const fontNormal = (props: any) =>
  get(
    props,
    'theme.style.fontNormal',
    get(props, 'theme.settings.fontNormal', "'Helvetica Neue', 'Helvetica', 'Arial', 'Sans-serif'")
  );

export const fontMedium = (props: any) =>
  get(props, 'theme.settings.fontMedium', "'Helvetica Neue', 'Helvetica', 'Arial', 'Sans-serif'; font-weight: bold");
export const fontTitle = (props: any) =>
  get(
    props,
    'theme.style.fontTitle',
    get(props, 'theme.settings.fontTitle', "'Helvetica Neue', 'Helvetica', 'Arial', 'Sans-serif'")
  );

// Font sizes
export const h1 = (props: any) => get(props, 'theme.style.h1', get(props, 'theme.settings.h1', '24px'));
export const h2 = (props: any) => get(props, 'theme.style.h2', get(props, 'theme.settings.h2', '22px'));
export const h3 = (props: any) => get(props, 'theme.style.h3', get(props, 'theme.settings.h3', '20px'));
export const h4 = (props: any) => get(props, 'theme.style.h4', get(props, 'theme.settings.h4', '18px'));

export const fontSizeBodyText = (props: any) =>
  get(props, 'theme.style.fontSizeBodyText', get(props, 'theme.settings.fontSizeBodyText', '16px'));

export const fontSizeSmall = (props: any) =>
  get(props, 'theme.style.fontSizeSmall', get(props, 'theme.settings.fontSizeSmall', '14px'));

export const fontSizeStatusBar = (props: any) =>
  get(props, 'theme.style.fontSizeStatusBar', get(props, 'theme.settings.fontSizeStatusBar', '12px'));

export const blogTitle = (props: any) => get(props, 'theme.settings.blogTitle', '40px');
export const fontWeight = (props: any) => get(props, 'theme.settings.fontWeight', 'bold');

// Buttons
export const buttonBgColor = (props: any) =>
  get(props, 'theme.style.accentColor', get(props, 'theme.settings.buttonBgColor', '#00B2E8'));
export const buttonBorder = (props: any) => get(props, 'theme.settings.buttonBorder', '0.5px solid #111111');
export const buttonBoxShadow = (props: any) =>
  get(props, 'theme.settings.buttonBoxShadow', '1px 1px 0.5px 0 rgba(70, 70, 70, 0.3)');
// Text
export const buttonTextColor = (props: any) => get(props, 'theme.settings.buttonTextColor', '#ffffff');
export const buttonFont = (props: any) =>
  get(props, 'theme.settings.buttonFont', "'Helvetica Neue', 'Helvetica', 'Arial', 'Sans-serif'");
export const buttonFontSize = (props: any) => get(props, 'theme.settings.buttonFontSize', '16px');

// Hover
export const buttonBgColorHover = (props: any) => get(props, 'theme.settings.buttonBgColorHover', '#00B2E8');
export const buttonHoverTextColor = (props: any) => get(props, 'theme.settings.buttonHoverTextColor', '#ffffff');

// Active
export const buttonBgColorActive = (props: any) =>
  get(props, 'theme.settings.buttonBgColorActive', 'rgba(0, 178, 232, 0.5)');
export const buttonActiveTextColor = (props: any) =>
  get(props, 'theme.style.accentColor', get(props, 'theme.settings.buttonActiveTextColor', '#00B2E8'));

// Inverted
export const buttonBgColorInverted = (props: any) => get(props, 'theme.settings.buttonBgColorInverted', 'none');
export const buttonBgColorHoverInverted = (props: any) =>
  get(props, 'theme.settings.buttonBgColorHoverInverted', 'rgba(0, 182, 124, 0.1)');
export const buttonBgColorActiveInverted = (props: any) =>
  get(props, 'theme.settings.buttonBgColorActiveInverted', 'rgba(0, 182, 124, 0.5)');

// Event color

export const AccentColor = (props: any) =>
  get(props, 'theme.style.accentColor', get(props, 'theme.settings.AccentColor', '#00B2E8'));

export const SecondAccentColor = (props: any) => get(props, 'theme.settings.SecondAccentColor', '#B1B1B1');

export const pollTextColor = (props: any) => get(props, 'theme.settings.pollTextColor', '#ffffff');

// Arrow color
export const BackArrowColor = (props: any) => get(props, 'theme.settings.BackArrowColor', '#aaa293');

export const arrow =
  'content: "";position: absolute;display: inline-block; vertical-align: top; transform: rotate(-45deg); top: calc(55% - 10px); right: 20px; width: 10px; height: 10px; border-right: 2px solid #00B2E8; border-bottom: 2px solid #00B2E8;';

export const profileImageSize = {
  tiny: '25px',
  comment: '35px' /* FIXME: remove this */,
  small: '50px',
  medium: '80px',
  large: '200px'
};

export const profileInitialsFontSize = {
  tiny: '12px',
  comment: '12px' /* FIXME: remove this */,
  small: '24px',
  medium: '30px',
  large: '75px'
};

export const zIndexes = {
  /**
   * Above everything else
   */
  onTop: 1000,

  /**
   * Dialogs
   */
  dialog: 500,

  /**
   * Profile popup
   */
  profilePopup: 250,

  /**
   * User menu
   */
  userMenu: 100
};

export default {
  colorTitle,
  colorText,
  buttonBgColor,
  colorLight,

  backgroundColor,
  discreteBackgroundColor,

  fontNormal,
  fontTitle,

  fontSizeBodyText,
  fontSizeSmall,
  fontSizeStatusBar,
  h1,
  h2,
  h3,
  h4,
  profileImageSize,
  profileInitialsFontSize,
  zIndexes
};
