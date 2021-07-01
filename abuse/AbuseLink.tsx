import React, { MouseEvent, Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { report } from '@stackend/api/abuse';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import * as Sc from './AbuseLink.style';
import get from 'lodash/get';
import { CurrentUserType } from '@stackend/api/login/loginReducer';
import { XcapObject } from '@stackend/api/api';

function mapStateToProps(state: any): {
  currentUser: CurrentUserType
} {
  const currentUser: CurrentUserType = state;
  return {
    currentUser
  };
}

const mapDispatchToProps = {
  report
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export interface Props extends ConnectedProps<typeof connector>, WrappedComponentProps {
  object: XcapObject;
}

/**
 * A link that allows reporting abuse
 *
 * @since 3 apr 2017
 */
class AbuseLink extends Component<Props> {
  handleClick = (e: MouseEvent): void => {
    e.preventDefault();
    const { intl, report, object } = this.props;

    // FIXME: Use something nicer than confirm()
    const abuseText = prompt(
      intl.formatMessage({
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

  render(): JSX.Element | null {
    const { currentUser, object, intl } = this.props;

    const o = object as any;

    // Only authorized users are allowed to report objects they did not create them self
    if (
      currentUser.isLoggedIn &&
      typeof o.obfuscatedReference !== 'undefined' &&
      (typeof o.creatorUserId === 'undefined' || o.creatorUserId !== get(currentUser, 'user.id'))
    ) {
      return (
        <Sc.AbuseLink
          to="javascript:{}"
          title={intl.formatMessage({
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
export default injectIntl(connector(AbuseLink));
