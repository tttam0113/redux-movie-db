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
