import { createStore, applyMiddleware, compose } from 'redux';
import ReduxThunk from 'redux-thunk';
import rootReducer from '../reducers';

const middlewares = [
  // Add other middleware on this line...

  // thunk middleware can also accept an extra argument to be passed to each thunk action
  // https://github.com/gaearon/redux-thunk#injecting-a-custom-argument
  ReduxThunk,
  // logger, // use during development alone
];

const store = createStore(
  rootReducer,
  {},
  compose(applyMiddleware(...middlewares)),
  // compose(applyMiddleware(...middlewares, offline(offlineConfig))),
);

// const persistor = persistStore(store);

// export default { store, persistor };
export default { store };
