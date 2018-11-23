import loggerMiddleware from '../logger';

import mockMiddleware from 'tests/__mocks__/mockMiddleware';

const create = mockMiddleware(loggerMiddleware);

let getState, next, invoke;
beforeEach(() => {
    const res = create();
    getState = res.store.getState;
    next = res.next;
    invoke = res.invoke;

    process.env.NODE_ENV = 'development';
});

it('should pass through any action object', () => {
    const action = { type: 'TEST' };

    invoke(action);

    expect(next).toBeCalledWith(action);
});

it('should get previous and next state', () => {
    const action = { type: 'TEST' };

    invoke(action);

    expect(getState).toBeCalledTimes(2);
});

it('should not get prev and next state in production mode', () => {
    process.env.NODE_ENV = 'production';;
    
    const action = { type: 'TEST' };
    
    invoke(action);

    expect(next).toBeCalled();
    expect(getState).toBeCalledTimes(0);
});