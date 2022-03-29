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
  ACCENT = 'accent',

  /** Menu bars */
  MENU = 'menu'
}

export default ComponentType;

/**
 * Does this component represent a single standard html element, or is it a composite widget?
 * @param componentType
 */
export function isStandardComponent(componentType: ComponentType): boolean {
  switch (componentType) {
    case ComponentType.BOX:
    case ComponentType.ACCENT:
      return false;
    default:
      return true;
  }
}

/**
 * Is this component a form element?F
 * @param componentType
 */
export function isFormElement(componentType: ComponentType): boolean {
  switch (componentType) {
    case ComponentType.BUTTON:
    case ComponentType.BUTTON_DANGER:
    case ComponentType.BUTTON_DEFAULT:
    case ComponentType.TEXT_INPUT:
    case ComponentType.SELECT:
      return true;
    default:
      return false;
  }
}
