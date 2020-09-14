import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as Sc from './Throbber.style';

function mapStateToProps({ throbber }: any, _getState: any): Props {
  return {
    loading: throbber.loading
  };
}

const mapDispatchToProps = {};

type Props = {
  loading?: boolean;
};

/**
 * A global loading throbber with unintrusive design.
 * Typically used for api calls.
 * A single instance should be used for the entire application.
 */
class LoadingThrobber extends Component<Props> {
  render(): JSX.Element | null {
    const { loading } = this.props;

    return loading ? <Sc.LoadingThrobber /> : null;
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(LoadingThrobber);
