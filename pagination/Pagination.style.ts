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
  ${props => !!props.theme.PaginationButtons && props.theme.PaginationButtons(props)};
`;

export const PaginationMoreButton = styled.button`
  background: none;
  border: none;
  width: 100%;
  text-align: center;
  padding: ${props => props.theme.margins.medium} 0;
  margin-top: ${props => props.theme.margins.medium};

  &:focus {
    outline: none;
  }

  &.stackend-pagination-previous {
    border-top: none;
  }

  ${props => !!props.theme.PaginationMoreButton && props.theme.PaginationMoreButton};
`;
