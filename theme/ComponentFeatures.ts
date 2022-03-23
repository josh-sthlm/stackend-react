import ComponentType from './ComponentType';

/**
 * Describes the available features of a component
 */
export interface ComponentFeatures {
  border: boolean;
  outline: boolean;
  background: boolean;
  states: {
    hover: boolean;
    focused: boolean;
    disabled: boolean;
  };
}

export const NO_STATES = {
  hover: false,
  focused: false,
  disabled: false
};

export const CONTROL_COMPONENT_FEATURES: ComponentFeatures = {
  border: true,
  outline: true,
  background: true,
  states: {
    hover: false,
    focused: true,
    disabled: true
  }
};

export const HEADER_FEATURES: ComponentFeatures = {
  border: false,
  outline: false,
  background: false,
  states: NO_STATES
};

/**
 * Features of all components
 */
export const COMPONENT_FEATURES: { [type in ComponentType]?: ComponentFeatures } = {
  [ComponentType.TEXT]: {
    border: false,
    outline: false,
    background: true,
    states: NO_STATES
  },
  [ComponentType.H1]: HEADER_FEATURES,
  [ComponentType.H2]: HEADER_FEATURES,
  [ComponentType.H3]: HEADER_FEATURES,
  [ComponentType.H4]: HEADER_FEATURES,
  [ComponentType.BUTTON]: {
    border: true,
    outline: true,
    background: true,
    states: {
      hover: true,
      focused: true,
      disabled: true
    }
  },
  [ComponentType.SELECT]: CONTROL_COMPONENT_FEATURES,
  [ComponentType.TEXT_INPUT]: CONTROL_COMPONENT_FEATURES,
  [ComponentType.LINK]: {
    border: false,
    outline: true,
    background: false,
    states: {
      hover: true,
      focused: true,
      disabled: false
    }
  },
  [ComponentType.BOX]: {
    border: true,
    outline: false,
    background: true,
    states: NO_STATES
  },
  [ComponentType.ACCENT]: {
    border: true,
    outline: false,
    background: true,
    states: NO_STATES
  }
};

export default ComponentFeatures;
