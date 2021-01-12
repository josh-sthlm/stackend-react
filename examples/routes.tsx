import React from 'react';
import { Route, IndexRoute } from 'react-router';

import IndexPage from './IndexPage';

export default function getRoutes(): JSX.Element {
  return (
    <Route path="/">
      <IndexRoute component={IndexPage} />
    </Route>
  );
}
