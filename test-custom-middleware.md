vanila js middleware, not use third party library. 
only using fetch, Promise in site effect

I applied an advanced redux pattern which introduced by Nir Kaufman.
You can find more detail in **[here](https://leanpub.com/thinking-in-Redux)**

So how to test custom middleware? 
How to create fetch, response for testing?

After googling and i found a document in **[Redux - Writing Tests](https://redux.js.org/recipes/writingtests)**
and **[Unit testing with Jest: Redux + async actions + fetch](https://medium.com/@ferrannp/unit-testing-with-jest-redux-async-actions-fetch-9054ca28cdcd)**

Now let's start testing.

I'm going to write some helper methods to support testing.

1. mockResponse to mock the fetch response

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

2. mockFetch to create a fake fetch and force it to return the response which i want to test

```javascript
export default fn => {
    window.fetch = jest.fn().mockImplementation(fn);
};
```

3. mockMiddleware to create some function spies for testing: getState, dispatch, next and invoke function to invoke an action

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

4. A small util wrap setTimeout to wait response from async request => need await in several milliseconds
```javascript
export default (fn, delay = 100) => {
    setTimeout(fn, delay);
}
```

#### Actions:

An action is nothing more than a plain Javascript object that bundles data together.

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
                feature: '[Feature]'
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
            type: `[Feature] ${API_ERROR}`,
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
Core middlewares are repsonsible for processing  generic actions. It should not be aware of any enities or other kind of business logic related to data models and therefore can be used in different contexts and even in other applications. The core middleware never depend on any other middleware.

Feature middlewares are responsible for implementing a specific flow. In most cases, a feature middleware will implement action routing patterns related to a specific feature without transforming the payload in any way. It cannot be reused in any other context. Like core middleware, the feature middleware never depend on other middleware

The Api middleware is a core middleware reponsible for communicating with the server via HTTP API cals. it processes an API_REQUEST command action and dispatches and API_SUCCESS or API_ERROR event action, depending on the result of the call. 
To keep our middleware generic, we will need to ignore the prefix in action type in order to identify the action type. So the apiMiddleware can be done as follows:

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
We have some cases to test this middleware:

1. Should pass through any action
    > **next()** is called with action 

2. Should call request when action include API_REQUEST 
    > **window.fetch()** is called                        

3. Should call request and dispatch success action if the fetch response was successful
    > **window.fetch()** is called
    > **dispatch()** is called with success action API_SUCCESS

4. Should call request and dispatch error action if an exception occurred
    > **window.fetch()** is called
    > **dispatch()** is called with error action API_ERROR

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

Second test case, a fetch is called. We can implement like this:
```javascript
it('Should call request when action include API_REQUEST', () => {
    const action = {
        type: '[Test] API_REQUEST',
        payload: null,
        meta: { url: '', method: 'GET', feature: '[Test]' }
    };
    mockFetch(() => Promise.resolve());

    invoke(action);

    expect(window.fetch).toBeCalled();
});
```

Third case, we create a successful response and we know the form of success action. So the implementation can be like: 
```javascript
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
```
In this test case we need a small delay to get response so wait() util is called.

Fourth test case is similar to third case. Instead of successful action we will create an exception and wait for error action is dispatched.
```javascript
it('should calls request and dispatch error action if an exception occured', done => {
    const response = 'Wrong JSON syntax';
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
That's all for api testing. Full implementation:

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

it('Should call request when action include API_REQUEST', () => {
    const action = {
        type: '[Test] API_REQUEST',
        payload: null,
        meta: { url: '', method: 'GET', feature: '[Test]' }
    };
    mockFetch(() => Promise.resolve());

    invoke(action);

    expect(window.fetch).toBeCalled();
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
    const response = 'Wrong JSON syntax';
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

