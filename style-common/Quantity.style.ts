import styled from 'styled-components';
import * as sc from './styled-variables.style';

export const QuantityStyle = styled.span.attrs({
  className: 'stackend-quantity'
})`
  color: ${sc.colorText};
  font-size: ${sc.fontSizeStatusBar};
  font-family: ${sc.fontNormal};

  ${props => !!props.theme.Quantity && props.theme.Quantity(props)};
`;

export default QuantityStyle;
