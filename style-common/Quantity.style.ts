import styled from 'styled-components';

export const QuantityStyle = styled.span.attrs({
  className: 'stackend-quantity'
})`
  ${props => !!props.theme.Quantity && props.theme.Quantity(props)};
`;

export default QuantityStyle;
