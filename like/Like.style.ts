import styled from 'styled-components';

import QuantityStyle from '../style-common/Quantity.style';
import classNames from '../style-common/classNames';

export const LikeButton = styled.button.attrs(props => ({
  className: classNames('stackend-like stackend-icon', props.className)
}))<{ liked: boolean }>`
  background: none;
  padding: 0;
  border: none;

  ${QuantityStyle} {
    margin-right: ${props => props.theme.margins?.small || '0.5em'};
  }

  &:focus {
    outline: none;
  }

  ${props => !!props.theme.LikeButton && props.theme.LikeButton};
`;

export default LikeButton;
