//@flow

import React, { Component } from 'react';
import * as Sc from './NumberEntry.style';

type Props = {
  value: number;
  max?: number;
  min?: number;
  onChange: (value: number) => void;
};

export default class NumberEntry extends Component<Props> {
  render(): JSX.Element {
    return (
      <Sc.NumberEntry>
        <button className="stackend-is-icon stackend-decrease" onClick={this.onDecrease}>
          -
        </button>
        <span className="value">{this.props.value}</span>
        <button className="stackend-is-icon stackend-increase" onClick={this.onIncrease}>
          +
        </button>
      </Sc.NumberEntry>
    );
  }

  onIncrease = (): void => {
    const { onChange, max } = this.props;
    if (onChange) {
      const v = this.props.value + 1;
      if (typeof max === 'undefined' || v <= max) {
        onChange(v);
      }
    }
  };

  onDecrease = (): void => {
    const { onChange, min } = this.props;

    if (onChange) {
      const v = this.props.value - 1;
      if (typeof min === 'undefined' || v >= min) {
        onChange(v);
      }
    }
  };
}
