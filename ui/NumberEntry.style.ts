//@flow
import styled from 'styled-components';

export const NumberEntry = styled.span.attrs({ className: 'stackend-number-entry' })`
  display: flex;
  align-items: center;

  box-sizing: border-box;
  color: var(--input-fore-color);
  margin: calc(var(--universal-margin) / 2);

  .value {
    min-width: 2em;
    text-align: center;
  }
`;
