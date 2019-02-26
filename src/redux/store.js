import { createStore, combineReducers, applyMiddleware, compose } from 'redux';

import actionSplitterMiddleware from './middleware/core/actionSplitter';
import apiMiddleware from './middleware/core/api';
import loggerMiddleware from './middleware/core/logger';

import moviesMiddleware from './middleware/features/movies';
import movieMiddleware from './middleware/features/movie';
import creditsMiddleware from './middleware/features/credits';

import uiReducer from './reducers/ui';
import homeReducer from './reducers/movies';
import movieReducer from './reducers/movie';

const rootReducer = combineReducers({
  home: homeReducer,
  movie: movieReducer,
  ui: uiReducer,
});

const featureMiddleware = [moviesMiddleware, movieMiddleware, creditsMiddleware];

const coreMiddleware = [actionSplitterMiddleware, apiMiddleware, loggerMiddleware];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancer = composeEnhancers(applyMiddleware(...featureMiddleware, ...coreMiddleware));

// const store = createStore(rootReducer, {}, enhancer);
export default createStore(rootReducer, {}, enhancer);
