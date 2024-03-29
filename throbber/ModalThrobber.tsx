import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as Sc from './Throbber.style';

function mapStateToProps({ throbber }: any, _x: any): Props {
  return {
    visible: throbber.visible
  };
}

const mapDispatchToProps = {};

type Props = {
  visible?: boolean;
};

/**
 * A global throbber that occupies the entire screen when visible.
 * A single instance should be used for the entire application.
 */
class ModalThrobber extends Component<Props> {
  render(): JSX.Element | null {
    const { visible } = this.props;

    return visible ? (
      <Sc.ModalThrobberOverlay>
        <Sc.ModalThrobber />
      </Sc.ModalThrobberOverlay>
    ) : null;
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ModalThrobber);
