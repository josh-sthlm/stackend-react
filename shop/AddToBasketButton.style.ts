//@flow
import styled from 'styled-components';

import { ShopButtonCommon } from './Shop.style';
import classNames from '../style-common/classNames';

export const AddToBasketButton = styled.button.attrs(props => ({
  className: classNames('stackend-add-to-basket', props.className)
}))`
  ${ShopButtonCommon};
`;
