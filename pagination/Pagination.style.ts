import styled from 'styled-components';

export const PaginationFull = styled.div.attrs({
  className: 'stackend-pagination stackend-pagination-full'
})`
  width: 100%;
  display: grid;
  /*
	grid-template-columns: auto 1fr 1fr auto;
	grid-column-gap: 2em;
	*/

  grid-template-columns: min-content auto auto min-content;

  button {
    font-size: 1.5em;
  }

  .stackend-first {
    margin-left: 0;
    padding-left: 0;
  }

  .stackend-last {
    margin-right: 0;
    padding-right: 0;
  }

  .stackend-next {
    text-align: right;
  }

  .stackend-previous {
    text-align: left;
  }
`;

export const PaginationCompact = styled.div.attrs({
  className: 'stackend-pagination stackend-pagination-compact'
})``;

export const PaginationWrapper = styled.div.attrs({
  className: 'stackend-pagination stackend-pagination-numbered'
})`
  display: flex;
  justify-content: center;
  flex-direction: row;
  width: 100%;

  ${props => !!props.theme.PaginationWrapper && props.theme.PaginationWrapper(props)};
`;

export const PaginationButtons = styled.button<{ prev?: boolean; current?: boolean }>`
  padding: 0 10px;
  height: 32px;
  margin: 5px;
  border-radius: 3px;

  ${props => !!props.theme.PaginationButtons && props.theme.PaginationButtons(props)};
`;

export const PaginationMoreButton = styled.button`
  display: inline-block;
  background: none;
  width: 100%;
  text-align: center;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  padding: 10px 0;
  margin-top: 8px;
  border-top: 2px solid #f9f9f9;

  &:focus {
    outline: none;
  }

  &.stackend-pagination-previous {
    border-top: none;
  }

  ${props => !!props.theme.PaginationMoreButton && props.theme.PaginationMoreButton};
`;
