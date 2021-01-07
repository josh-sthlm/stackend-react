# [About Stackend](https://stackend.com)

Stackend.com is backend, frontend & hosting in a single line of code, or if you prefer - a downloadable NPM package.
It contains of hosted, pre-made modules with focus on community driven features that you can add to your new or existing project.
To use Stackend you need to create a Stackend account, and a Stack (your cloud based backend, frontend and admin).

## Stackend React

This library contains React components for Stackend modules.

_NOTE_: Right now this library is under development and not ready for general use.
The API may change at any time. Use on your own risk.

## Installation

```shell script
npm install --save @stackend/api @stackend/react
```

## Noteworthy Dependencies

- [Stackend JS API](https://www.npmjs.com/package/@stackend/api) is the layer used to talk to Stackend.com
- [Redux](https://redux.js.org/) Used by some components to store state. Used by Stackend JS API to store data.
- [Styled Components](https://styled-components.com/) Used for styling.
- [React Intl](https://formatjs.io/docs/react-intl/) For translations

## Setup

You will need to set up a Redux store and initialize the API with the community you will use:

```javascript
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { STANDARD_REDUCERS } from '@stackend/api/api/reducers';
import { REDUCERS } from '@stackend/react/reducers';
import { initialize } from '@stackend/api/api/actions';
import { getCurrentCommunity } from '@stackend/api';

// Possibly add your own reducers and middleware here
const reducers = {
  ...STANDARD_REDUCERS,
  ...REDUCERS
};

const store = createStore(combineReducers(reducers), {}, compose(applyMiddleware(thunk)));

await store.dispatch(
  initialize({
    permalink: 'stackend-com' /* Replace with your community permalink */
  })
);
```

Then you can write your own application using Stackend components:
Add LoadingThrobber and ModalThrobber to get feedback when backend requests are made.

```typescript jsx
import LoadingThrobber from '@stackend/react/throbber/LoadingThrobber';
import ModalThrobber from '@stackend/react/throbber/ModalThrobber';
import Content from '@stackend/react/cms/Content';
import { Content as CmsContent } from '@stackend/api/cms';
import { CmsState } from '@stackend/api/cms/cmsReducer';
import { fetchContent } from '@stackend/api/cms/cmsActions';
import { connect } from 'react-redux';

const MY_CMS_ID = 123;

type Props = {
  content: CmsContent;
};

const mapDispatchToProps = {
  fetchContent
};

function mapStateToProps(state: any) {
  const cms: CmsState = state.cmsContent;
  return {
    content: cms[MY_CMS_ID]
  };
}

class MyApp extends Component<Props> {
  componentDidMount() {
    this.props.fetchContent({ id: MY_CMS_ID });
  }

  render() {
    const { content } = this.props;
    return (
      <div>
        {/* Stackend throbbers used to indicate when the app is loading / saving */}
        <LoadingThrobber />
        <ModalThrobber />

        {/* A stackend component displaying some cms content */}
        <Content content={content} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyApp);
```
