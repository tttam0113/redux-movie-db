import { createStore, combineReducers, applyMiddleware, compose } from 'redux';

import actionSplitterMiddleware from './middleware/core/actionSplitter';
import apiMiddleware from './middleware/core/api';
import loggerMiddleware from './middleware/core/logger';

import moviesMiddleware from './middleware/features/movies';

import uiReducer from './reducers/ui';
import homeReducer from './reducers/movies';

const rootReducer = combineReducers({
    home: homeReducer, 
    ui: uiReducer
});

const featureMiddleware = [ moviesMiddleware ];

const coreMiddleware = [
    actionSplitterMiddleware,
    apiMiddleware,
    loggerMiddleware
];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancer = composeEnhancers(
    applyMiddleware(...featureMiddleware, ...coreMiddleware)
);

// const store = createStore(rootReducer, {}, enhancer);
export default createStore(rootReducer, {}, enhancer);
