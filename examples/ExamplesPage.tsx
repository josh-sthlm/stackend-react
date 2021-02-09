//@flow
import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import * as Sc from './ExamplesPage.style';
import LoadingThrobber from '../throbber/LoadingThrobber';
import ModalThrobber from '../throbber/ModalThrobber';

type Props = {
  routes: any;
  store: any;
};

function mapStateToProps({ request }: any): any {
  return {
    request
  };
}

const mapDispatchToProps = {};

class ExamplesPage extends Component<Props> {
  render(): JSX.Element {
    return (
      <Sc.ExamplesPage>
        <LoadingThrobber />
        <ModalThrobber />
        <header className="header">
          <h1>Stackend React examples</h1>
        </header>
        <div className="menu">
          <ul>
            <li>
              <Link to="/">Start</Link>
            </li>
            <li>Comments</li>
            <li>Feed</li>
            <li>
              Shop
              <ul>
                <li>
                  <Link to="/shop/product-listing">Product listing</Link>
                </li>
                <li>
                  <Link to="/shop/product">Product</Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div className="example">{this.props.children}</div>
      </Sc.ExamplesPage>
    );
  }
}

export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(ExamplesPage));
