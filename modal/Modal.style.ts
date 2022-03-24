import styled from 'styled-components';

export const ModalContent = styled.div.attrs(props => ({
  className: 'stackend-modal-content'
}))`
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  height: 100%;
  padding: ${props => props.theme.margins.small};
`;
