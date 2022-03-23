/**
 * Type of components supported by themes
 */
export enum ComponentType {
  TEXT = 'text',
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  H4 = 'h4',
  BUTTON = 'button',

  /** Buttons with stackend-positive-action */
  BUTTON_DEFAULT = 'buttonDefault',

  /** Buttons with stackend-danger-action */
  BUTTON_DANGER = 'buttonDanger',

  SELECT = 'select',

  /** All kinds of text inputs, and controls that looks like text inputs */
  TEXT_INPUT = 'textInput',
  LINK = 'link',

  /** A box with borders, margins and possibly a different background color */
  BOX = 'box',

  /** Accent colors */
  ACCENT = 'accent'
}

export default ComponentType;
