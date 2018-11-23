import creditsMiddleware from '../credits';

import mockMiddleware from 'tests/__mocks__/mockMiddleware';
import mockResponse from 'tests/__mocks__/mockResponse';
import mockFetch from 'tests/__mocks__/mockFetch';
import wait from 'tests/__mocks__/wait';

const create = mockMiddleware(creditsMiddleware);

let next, invoke;
beforeEach(() => {
    const res = create();
    next = res.next;
    invoke = res.invoke;
});

it('should pass through any action object', () => {
    const action = { type: 'TEST' };

    invoke(action);

    expect(next).toBeCalled();
});
