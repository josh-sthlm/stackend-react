//@flow
import styled from 'styled-components';
import classNames from '../style-common/classNames';

export const NumberEntry = styled.span.attrs(props => ({ className: classNames('stackend-number-entry', props.className) }))`
  display: flex;
  align-items: center;

  box-sizing: border-box;

  .value {
    min-width: 2em;
    text-align: center;
  }
`;
