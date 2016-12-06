import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { app } from './reducers/index.jsx';

const configureStore = () => {
  const middlewares = [thunk];
  middlewares.push(createLogger());

  return createStore(
    app,
    applyMiddleware(...middlewares)
  );
};

export default configureStore;