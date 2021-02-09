import React from 'react';
import { Route, IndexRoute } from 'react-router';

import IndexPage from './IndexPage';
import CommentsPage from './CommentsPage';
import ExamplesPage from './ExamplesPage';
import ShopProductListingPage from './ShopProductListingPage';
import ShopProductPage from './ShopProductPage';

export default function getRoutes(): JSX.Element {
  return (
    <Route path="/" component={ExamplesPage}>
      <IndexRoute component={IndexPage} />
      <Route path="comments" component={CommentsPage} />
      <Route path="shop/product-listing" component={ShopProductListingPage} />
      <Route path="shop/product" component={ShopProductPage} />
    </Route>
  );
}
