import React from 'react';
import { hydrate } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import createReduxStore from './createReduxStore';
import Examples from './Examples';
import getRoutes from './routes';

async function main() {
  const store = await createReduxStore();
  const routes = getRoutes();

  //const mountNode = document.getElementById('stackend-examples-app');
  const mountNode = document.createElement('div');
  mountNode.setAttribute('id', 'stackend-examples-app');
  document.body.appendChild(mountNode);

  if (mountNode) {
    const renderApp = (appRoutes: any): void => {
      hydrate(
        <AppContainer>
          <IntlProvider locale="en">
            <Provider store={store as any}>
              <Examples routes={appRoutes} store={store} />
            </Provider>
          </IntlProvider>
        </AppContainer>,
        mountNode
      );
    };

    renderApp(routes);

    if (module.hot) {
      module.hot.accept(['./Examples.tsx', './routes.tsx'], () => {
        setImmediate(() => {
          const newRoutes = require('./routes.tsx').getRoutes();
          renderApp(newRoutes);
        });
      });
    }
  }
}

main();
