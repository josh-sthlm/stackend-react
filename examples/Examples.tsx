//@flow
import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { Request } from '@stackend/api/request';

type Props = {
  routes: any;
  store: any;
};

function mapStateToProps({ request }: any): {
  request: Request
} {
  return {
    request
  };
}

const mapDispatchToProps = {};

class Examples extends Component<Props> {
  render(): JSX.Element {
    const routes = this.props.routes;
    return (
      <Router
      /*
        onUpdate={(): void => {
          window.scrollTo(0, 0);
        }}
        history={browserHistory}
         */
      >
        {routes}
      </Router>
    );
  }
}

export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(Examples));
