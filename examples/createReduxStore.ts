import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { STANDARD_REDUCERS } from '@stackend/api/api/reducers';
import { REDUCERS } from '../reducers';
//import { initialize } from '@stackend/api/api/actions';
//import { getCurrentCommunity } from '@stackend/api';

// Possibly add your own reducers and middleware here
const reducers = {
  ...STANDARD_REDUCERS,
  ...REDUCERS
};

export default async function createReduxStore(): Promise<any> {
  const store = createStore(combineReducers(reducers), {}, compose(applyMiddleware(thunk)));

  /*
  await store.dispatch(
    initialize({
      permalink: 'stackend-com'
    })
  );
  */
  return store;
}
