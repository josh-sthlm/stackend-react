
import React, { MouseEvent } from 'react';
import { connect } from 'react-redux';
import { report } from '@stackend/api/abuse';
import { useIntl } from 'react-intl';
import * as Sc from './AbuseLink.style';
import _ from 'lodash';
import { CurrentUserType } from '@stackend/api/login/loginReducer';
import { XcapObject } from '@stackend/api/api';

function mapStateToProps({ currentUser } : any, _x: any) {
	return {
		currentUser
	};
}

const mapDispatchToProps = {
  report
}

export type Props = {
  currentUser: CurrentUserType,
  object: XcapObject,
  report?: typeof report
}

/**
 * A link that allows reporting abuse
 *
 * @since 3 apr 2017
 */
class AbuseLink extends React.Component<Props> {

	intl = useIntl();

	handleClick = (e: MouseEvent) => {
		e.preventDefault();
    const { report, object } = this.props;

		// FIXME: Use something nicer than confirm()
		let abuseText = prompt(
			this.intl.formatMessage({
				id: 'AbuseLink.prompt',
				defaultMessage: 'Report abuse.\nPlease describe why this content should be removed?'
			})
		);


		if (abuseText !== null && report) {
      report({
        obfuscatedReference: (object as any).obfuscatedReference,
        abuseText
      });
		}
	};

	render() {
		const { currentUser, object } = this.props;

		let o = object as any;

		// Only authorized users are allowed to report objects they did not create them self
		if (
			currentUser.isLoggedIn &&
			typeof o.obfuscatedReference !== 'undefined' &&
			(typeof o.creatorUserId === 'undefined' || o.creatorUserId !== _.get(currentUser, "user.id"))
		) {
			return (
				<Sc.AbuseLink
					to="javascript:{}"
					title={this.intl.formatMessage({
						id: 'AbuseLink.report-abuse',
						defaultMessage: 'Report abuse'
					})}
					rel="nofollow"
					className="stackend-abuse-link"
					onClick={this.handleClick}>
					<i className="material-icons">flag</i>
				</Sc.AbuseLink>
			);
		}

		return null;
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(AbuseLink);
