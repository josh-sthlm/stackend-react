import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const AbuseLink = styled(Link)`
  align-self: center;
  position: absolute;
  right: 0;
  cursor: pointer;
  ${props => !!props.theme.AbuseLink && props.theme.AbuseLink(props)};
`;

/* Orig
export const AbuseLink = styled(({ profile, children, ...rest }) => (
  <Link {...rest}>{children}</Link>
))`
	align-self: center;
	position: absolute;
	right: 0;
	cursor: pointer;

	${props => !!props.theme.AbuseLink && props.theme.AbuseLink(props)};
`;
 */

export default AbuseLink;
