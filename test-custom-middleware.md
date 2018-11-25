vanila js middleware, not use third party library. 
only using fetch, Promise in site effect

how to test custom middleware


create mockResponse 

```javascript
const mockResponse = (status, statusText, response) => {
    return new window.Response(response, {
        status: status,
        statusText: statusText,
        headers: {
            'Content-type': 'application/json'
        }
    });
};

export default mockResponse;
```

create mockFetch
In *tests/__mocks__/mockFetch*
```javascript
export default fn => {
    window.fetch = jest.fn().mockImplementation(fn);
};
```

create mockMiddleware - high order function
In *tests/__mocks__/mockMiddleware*
```javascript
const create = (middleware) => () => {
    const store = {
        getState: jest.fn(() => ({})),
        dispatch: jest.fn()
    };
    const next = jest.fn();
    const invoke = action => middleware(store)(next)(action);

    return { store, next, invoke };
};

export default create;
```

async request => need await in several milliseconds
In *tests/__mocks__/wait.js*
```javascript
export default (fn, delay = 100) => {
    setTimeout(fn, delay);
}
```

I use an advanced redux pattern which introduced by Nir Kaufman.
You can find more detail in here: https://leanpub.com/thinking-in-Redux

#### Actions:

An action is nothing more than a plain Javascript object that bundels data together.

I use same struct for all actions, just 3 fields: type, payload, meta. An action creator will be like this: 

```javascript
export const API_REQUEST = 'API_REQUEST';
export const apiRequest = ({method, url, data, feature}) => ({
    type: `${feature} ${API_REQUEST}`,
    payload: data,
    meta: {
        method, url, feature
    } 
});
```
api actions is reused in many cases so feature is needed to distinguish what feature is making request api.

Full feature actions: 

```javascript
// action types
export const API_REQUEST = 'API_REQUEST';   // command action
export const API_SUCCESS = 'API_SUCCESS';   // event action
export const API_ERROR = 'API_ERROR';       // event action

// action creators
export const apiRequest = ({ method, url, data, feature }) => ({
    type: `${feature} ${API_REQUEST}`,
    payload: data,
    meta: {
        method,
        url,
        feature
    }
});

export const apiSuccess = ({ response, data, feature }) => ({
    type: `${feature} ${API_SUCCESS}`,
    payload: response,
    meta: { data, feature }
});

export const apiError = ({ error, data, feature }) => ({
    type: `${feature} ${API_ERROR}`,
    payload: error,
    meta: { data, feature }
});
```

Actions can be tested like: 

```javascript
import {
    API_REQUEST,
    API_SUCCESS,
    API_ERROR,
    apiRequest,
    apiError,
    apiSuccess
} from '../api';

describe('apiRequest', () => {
    it('should generate apiRequest action object', () => {
        const action = apiRequest({
            method: 'GET',
            url: 'http://localhost:3000/api',
            data: {
                key1: 'value1',
                key2: 'value2'
            },
            feature: '[Feature]'
        });

        expect(action).toEqual({
            type: `[Feature] ${API_REQUEST}`,
            payload: {
                key1: 'value1',
                key2: 'value2'
            },
            meta: {
                method: 'GET',
                url: 'http://localhost:3000/api',
                feature: 'FEATURE'
            }
        });
    });
});

describe('apiSuccess', () => {
    it('should generate apiSuccess action object', () => {
        const response = { id: '123' }
        const action = apiSuccess({
            response,
            data: {
                key1: 'value1',
                key2: 'value2'
            },
            feature: '[Feature]'
        });

        expect(action).toEqual({
            type: `FEATURE ${API_SUCCESS}`,
            payload: response,
            meta: {
                data: {
                    key1: 'value1',
                    key2: 'value2'
                },
                feature: '[Feature]'
            }
        });
    });
});

describe('apiError', () => {
    it('should generate apiError action object', () => {
        const error = "Error Message"
        const action = apiError({
            error,
            data: {
                key1: 'value1',
                key2: 'value2'
            },
            feature: '[Feature]'
        });

        expect(action).toEqual({
            type: `FEATURE ${API_ERROR}`,
            payload: "Error Message",
            meta: {
                data: {
                    key1: 'value1',
                    key2: 'value2'
                },
                feature: '[Feature]'
            }
        });
    });
});
```

#### Middleware
There are 2 types middlewares: core and feature
Core middleware process command actions and dispatch event actions to another middlwares.
Features middleware process event actions and dispatch document actions to reducers;

Api middleware:
```javascript
import { API_REQUEST, apiSuccess, apiError } from '../../actions/api';

const apiMiddleware = ({ dispatch }) => next => action => {
    next(action);

    if (action.type.includes(API_REQUEST)) {
        const data = action.payload;
        const { url, method, feature } = action.meta;
        fetch(url, { method })
            .then(response => response.json())
            .then(response => dispatch(apiSuccess({ response, data, feature })))
            .catch(error => dispatch(apiError({ error, data, feature })));
    }
};

export default apiMiddleware;
```

This middleware need 2 spies function: dispatch and next
Before each test case we will call mockMiddleware to get all needed spies:

```javascript 
import apiMiddleware from '../api';
import mockMiddleware from 'tests/__mocks__/mockMiddleware';
const create = mockMiddleware(apiMiddleware);

let dispatch, next, invoke;
beforeEach(() => {
    const res = create();
    dispatch = res.store.dispatch;
    next = res.next;
    invoke = res.invoke;
});
```

First test case is simple, it just check any action object will be passed through middleware.

```javascript
it('should pass through any action object', () => {
    const action = { type: 'TEST' };

    invoke(action);

    expect(next).toBeCalledWith(action);
});
```



Can be tested like: 
```javascript
import apiMiddleware from '../api';
import { API_REQUEST, API_SUCCESS, API_ERROR } from 'redux/actions/api';

import mockMiddleware from 'tests/__mocks__/mockMiddleware';
import mockResponse from 'tests/__mocks__/mockResponse';
import mockFetch from 'tests/__mocks__/mockFetch';
import wait from 'tests/__mocks__/wait';

const create = mockMiddleware(apiMiddleware);

let dispatch, next, invoke;
beforeEach(() => {
    const res = create();
    dispatch = res.store.dispatch;
    next = res.next;
    invoke = res.invoke;
});

it('should pass through any action object', () => {
    const action = { type: 'TEST' };

    invoke(action);

    expect(next).toBeCalledWith(action);
});

it('should calls request and dispatch success action if the fetch response was successful', done => {
    const response = '{ "id": "respid" }';
    mockFetch(() => Promise.resolve(mockResponse(200, null, response)));

    const action = {
        type: `[Feature] ${API_REQUEST}`,
        payload: { id: 123 },
        meta: { url: '', method: 'GET', feature: '[Feature]' }
    };

    invoke(action);

    const successAction = {
        type: `[Feature] ${API_SUCCESS}`,
        payload: JSON.parse(response),
        meta: { data: { id: 123 }, feature: '[Feature]' }
    };

    expect(window.fetch).toBeCalled();

    wait(() => {
        expect(dispatch).toHaveBeenCalledWith(successAction);
        done();
    });
});

it('should calls request and dispatch error action if an exception occured', done => {
    const response = "Wrong JSON syntax";
    mockFetch(() => Promise.resolve(mockResponse(200, 'OK', response)));

    const action = {
        type: `[Feature] ${API_REQUEST}`,
        payload: { id: 123 },
        meta: { url: '', method: 'GET', feature: '[Feature]' }
    };

    invoke(action);

    const errorAction = {
        type: `[Feature] ${API_ERROR}`,
        payload: expect.any(Error),
        meta: { data: { id: 123 }, feature: '[Feature]' }
    };

    expect(window.fetch).toBeCalled();

    wait(() => {
        expect(dispatch).toHaveBeenCalledWith(errorAction);
        
        done();
    });
});
```

