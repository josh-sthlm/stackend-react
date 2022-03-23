import ComponentType from './ComponentType';
import ComponentState from './ComponentState';

export interface FontTheme {
  inheritFonts: boolean;
  fontFamily: string | null;
  fontSize: string;
  fontWeight: string;
  headingFontFamily: string | null;
  headingFontSize: string;
  headingFontWeight: string;
  controlFontFamily: string | null;
  controlFontSize: string;
  controlFontWeight: string;
}

export interface ColorTheme {
  inheritColors: boolean;
  color: string;
  backgroundColor: string;
  borderColor: string;
  borderWidth: string;
  borderRadius: string;
  outlineColor: string;
}

export interface ComponentStateTheme {
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  outlineColor?: string;
}

export interface ComponentTheme extends ComponentStateTheme {
  [ComponentState.ACTIVE_HOVER]?: ComponentStateTheme;
  [ComponentState.FOCUS]?: ComponentStateTheme;
  [ComponentState.DISABLED]?: ComponentStateTheme;
}

export interface MarginTheme {
  small: string;
  medium: string;
  large: string;
}

export interface StackendTheme extends FontTheme, ColorTheme {
  /**
   * Name of the theme
   */
  name: string;

  /**
   * Creation date.
   */
  date: number;

  // Note that ComponentType.TEXT is special, and part of ColorTheme
  [ComponentType.H1]: ComponentTheme;
  [ComponentType.H2]: ComponentTheme;
  [ComponentType.H3]: ComponentTheme;
  [ComponentType.H4]: ComponentTheme;
  [ComponentType.BUTTON]: ComponentTheme;
  [ComponentType.BUTTON_DEFAULT]: ComponentTheme;
  [ComponentType.BUTTON_DANGER]: ComponentTheme;
  [ComponentType.SELECT]: ComponentTheme;
  [ComponentType.TEXT_INPUT]: ComponentTheme;
  [ComponentType.LINK]: ComponentTheme;
  [ComponentType.BOX]: ComponentTheme;
  [ComponentType.ACCENT]: ComponentTheme;

  inheritMargins: boolean;
  margins: MarginTheme;

  /** External css libs for preview */
  libs: Array<string>;
}

/**
 * Create a new component state theme
 * @param defaults
 */
export function newComponentStateTheme(defaults?: ComponentStateTheme): ComponentStateTheme {
  return Object.assign({}, defaults);
}

/**
 * Apply a property value to all the states of a component theme
 * @param ct
 * @param prop
 * @param value
 */
export function applyToAllComponentStates(ct: ComponentTheme, prop: string, value: string): void {
  const t = ct as any;
  t[prop] = value;

  if (ct.hover) {
    t.hover[prop] = value;
  }
  if (ct.focus) {
    t.focus[prop] = value;
  }
  if (ct.disabled) {
    t.disabled[prop] = value;
  }
}

/**
 * Get a component prop, fall back to the normal state
 * @param theme
 * @param componentType
 * @param prop
 * @param state
 * @returns {*|null}
 */
export function getComponentProp(
  theme: StackendTheme,
  componentType: ComponentType,
  prop: string,
  state?: ComponentState
) {
  const t = theme as any;
  const ct = t[componentType];
  if (!ct) {
    return t[prop] || null;
  }

  if (state) {
    const st = ct[state];
    if (st) {
      const v = st[prop];
      if (v) {
        return v;
      }
    }
  }

  return ct[prop] || t[prop] || null;
}

export enum FontComponentType {
  TEXT = '',
  HEADING = 'heading',
  CONTROL = 'control'
}

/**
 * Get a component fort size, or fall back to the default
 * @param theme
 * @param fontComponentType
 * @returns {string|null|string|string|number|*}
 */
export function fontSize(theme: StackendTheme, fontComponentType?: FontComponentType) {
  if (fontComponentType) {
    const fs = (theme as any)[fontComponentType + 'FontSize'];
    return fs || theme.fontSize || null;
  }
  return theme.fontSize || null;
}

/**
 * Scale factors for the heading levels
 */
export const HEADING_FONT_SIZE_SCALE_FACTORS: {
  [key in ComponentType]?: number;
} = {
  [ComponentType.H1]: 1,
  [ComponentType.H2]: 0.5,
  [ComponentType.H3]: 0.25,
  [ComponentType.H4]: 0.125
};

/**
 * Get a font size scaled for the heading
 * @param theme
 * @param componentType
 * @returns {string}
 */
export function headingFontSize(theme: StackendTheme, componentType?: ComponentType): string | null {
  let s = theme.headingFontSize || '2em';

  const r = /([0-9.]+)(px|em|rem)/.exec(s);
  if (!r) {
    return s;
  }

  const value = parseFloat(r[1]);
  const unit = r[2];
  let factor = componentType ? HEADING_FONT_SIZE_SCALE_FACTORS[componentType] || 1 : 1;

  let sz = value;
  if (unit === 'px') {
    sz = value * factor;
  } else {
    sz = factor * (value - 1) + 1;
  }

  return sz + (unit + '');
}

/**
 * Get a components border, including with and color
 * @param theme
 * @param componentType
 */
export function getComponentBorder(theme: StackendTheme, componentType?: ComponentType) {
  let ct = theme;
  if (componentType) {
    ct = (theme as any)[componentType] || theme;
  }

  return theme.borderWidth + ' solid ' + (ct.borderColor || theme.borderColor);
}

/**
 * Get the component state theme
 * @param ct
 * @param state
 */
export function getComponentStateTheme(ct: ComponentTheme, state: ComponentState): ComponentStateTheme | null {
  const st = (ct as any)[state];
  return ct ? st || ct : null;
}

const DEFAULT_COMPONENT_THEME: ComponentTheme = {
  disabled: {
    color: '#7f7f7f'
  }
};

/**
 * Get the default theme settings
 * @returns StackendTheme
 */
export function getDefaultTheme(): StackendTheme {
  const t: StackendTheme = {
    name: 'Default Theme',
    date: Date.now(),
    inheritFonts: true,
    fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', 'Sans-serif'",
    fontSize: '16px',
    fontWeight: 'normal',
    headingFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', 'Sans-serif'",
    headingFontSize: '3rem',
    headingFontWeight: 'bold',
    controlFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', 'Sans-serif'",
    controlFontSize: '1rem',
    controlFontWeight: 'bold',

    inheritColors: true,
    color: '#000000',
    backgroundColor: '#ffffff',

    [ComponentType.H1]: {},
    [ComponentType.H2]: {},
    [ComponentType.H3]: {},
    [ComponentType.H4]: {},
    [ComponentType.BUTTON]: DEFAULT_COMPONENT_THEME,
    [ComponentType.BUTTON_DEFAULT]: DEFAULT_COMPONENT_THEME,
    [ComponentType.BUTTON_DANGER]: DEFAULT_COMPONENT_THEME,
    [ComponentType.SELECT]: DEFAULT_COMPONENT_THEME,
    [ComponentType.TEXT_INPUT]: DEFAULT_COMPONENT_THEME,
    [ComponentType.LINK]: DEFAULT_COMPONENT_THEME,
    [ComponentType.BOX]: {
      backgroundColor: '#f7f7f7'
    },
    [ComponentType.ACCENT]: {
      color: '#ffffff',
      backgroundColor: '#000000'
    },

    inheritMargins: true,
    margins: {
      small: '0.5em',
      medium: '0.75em',
      large: '1.5em'
    },

    borderWidth: '1px',
    borderRadius: '5px',
    borderColor: '#000000',
    outlineColor: '#000000',

    libs: []
  };
  return t;
}

/**
 * Given a theme, remove keys not supported and add missing keys with default values
 * @param t
 * @returns {*}
 */
export function getValidatedTheme(t: StackendTheme): StackendTheme {
  const d = getDefaultTheme();
  const v = Object.assign({}, d, t); // Apply defaults for missing keys

  // Remove unknown keys
  for (let key of Object.keys(v)) {
    if (!(d as any)[key]) {
      delete (v as any)[key];
    }
    if ((v as any)[key] === null || (v as any)[key] === undefined) {
      delete (v as any)[key];
    }
  }

  // Validate component themes
  for (let componentType of Object.values(ComponentType)) {
    const ct = (v as any)[componentType];

    if (ct) {
      if (!validateComponentThem(ct)) {
        delete (v as any)[componentType];
      }
    } else {
      if (componentType !== ComponentType.TEXT) {
        v[componentType] = newComponentStateTheme();
      }
    }
  }

  return v;
}

const VALID_PROPS = ['color', 'backgroundColor', 'borderColor', 'outlineColor'];

function validateComponentThem(ct: ComponentTheme): boolean {
  if (typeof ct !== 'object') {
    return false;
  }

  const states: Array<string> = [ComponentState.ACTIVE_HOVER, ComponentState.DISABLED, ComponentState.FOCUS];

  for (let key of Object.keys(ct)) {
    if (states.includes(key)) {
      const st = (ct as any)[key];
      if (!validateComponentStateTheme(st)) {
        delete (ct as any)[key];
      }
    } else if (VALID_PROPS.includes(key)) {
      if (typeof (ct as any)[key] != 'string') {
        delete (ct as any)[key];
      }
    } else {
      delete (ct as any)[key];
    }
  }

  return true;
}

function validateComponentStateTheme(st: ComponentStateTheme): boolean {
  if (typeof st !== 'object') {
    return false;
  }

  for (let key of Object.keys(st)) {
    if (!VALID_PROPS.includes(key) || typeof (st as any)[key] !== 'string') {
      delete (st as any)[key];
    }
  }
  return true;
}

/**
 * Set a component prop
 * @param theme
 * @param componentType
 * @param state
 * @param prop
 * @param value
 * @returns {*}
 */
export function setComponentProp(
  theme: StackendTheme,
  componentType: ComponentType,
  state: string,
  prop: string,
  value: string | null
): StackendTheme {
  // Applies to the theme
  if (componentType === ComponentType.TEXT) {
    return Object.assign({}, theme, {
      [prop]: value
    });
  }

  const componentTheme = theme[componentType];
  const ct: ComponentTheme = Object.assign({}, componentTheme);
  let st = ct;
  if (state !== 'normal') {
    st = (ct as any)[state];
    if (!st) {
      st = (ct as any)[state] = newComponentStateTheme(ct);
    }
  }

  // Reset
  if (value === null) {
    if (state === 'normal') {
      if ((theme as any)[prop]) {
        (ct as any)[prop] = (theme as any)[prop];
      } else {
        console.log('No fall back value for: ', componentType, prop, state);
      }
    } else {
      delete (st as any)[prop];
    }
  } else {
    (st as any)[prop] = value;
  }

  return Object.assign({}, theme, {
    [componentType]: ct
  });
}

export function resetComponentProp(
  theme: StackendTheme,
  componentType: ComponentType,
  prop: string,
  states: Array<string>
): StackendTheme {
  if (componentType === ComponentType.TEXT) {
    // FIXME: improve this. Could check inheritColors
    return theme;
  }

  const ct = Object.assign({}, theme[componentType]);
  for (let state of states) {
    const st = (ct as any)[state];
    if (st) {
      delete st[prop];
    }
  }

  return Object.assign({}, theme, {
    [componentType]: ct
  });
}

export default StackendTheme;
