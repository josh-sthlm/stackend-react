
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as Sc from './Throbber.style';

function mapStateToProps({ throbber }: any, _x: any) {
	return {
		visible: throbber.visible
	};
}

function mapDispatchToProps() {
	return {};
}

type Props = {};

type OwnProps = Props & {
	visible?: boolean
};

/**
 * A global throbber that occupies the entire screen when visible.
 * A single instance should be used for the entire application.
 */
class ModalThrobber extends Component<OwnProps> {
	render() {
		const { visible } = this.props;

		return visible ? (
			<Sc.ModalThrobberOverlay>
				<Sc.ModalThrobber />
			</Sc.ModalThrobberOverlay>
		) : null;
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(ModalThrobber);
