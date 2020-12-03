//@flow

import styled from 'styled-components';
import classNames from '../style-common/classNames';

export const ProductTypeSelect = styled.select.attrs(props => ({ className: classNames('stackend-product-type-select', props.className) }))``;
