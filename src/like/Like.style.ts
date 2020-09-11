import styled from 'styled-components';
import * as sc from '../style-common/styled-component-variables';
import QuantityStyle from '../style-common/Quantity.style';

export const LikeButton = styled.button.attrs({
  className: 'stackend-like'
})<{liked: boolean}>`
	display: flex;
	align-items: center;
	background: none;
	padding: 0;
	height: 20px;
	cursor: pointer;
	border: none;

	${QuantityStyle}, .material-icons {
		font-size: ${sc.fontSizeStatusBar};
		color: ${sc.colorText};
	}

	${QuantityStyle} {
		margin-right: 0.5em;
	}

	.material-icons:hover {
		color: ${sc.AccentColor};
	}

	&:focus {
		outline: none;
	}

	${props => !!props.theme.LikeButton && props.theme.LikeButton};
`;

export default LikeButton;
