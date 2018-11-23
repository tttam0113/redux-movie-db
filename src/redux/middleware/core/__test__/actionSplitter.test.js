import actionSplitterMiddleware from '../actionSplitter';
import mockMiddleware from 'tests/__mocks__/mockMiddleware';

const create = mockMiddleware(actionSplitterMiddleware);

it('should passes through action object', () => {
    const { next, invoke } = create();
    const action = { type: 'TEST' };

    invoke(action);

    expect(next).toBeCalledWith(action);
});

it('should passes through list actions', () => {
    const { next, invoke } = create();
    const actions = [{ type: 'TEST1' }, { type: 'TEST2' }, { type: 'TEST3' }];

    invoke(actions);

    expect(next).toBeCalledWith({ type: 'TEST1' });
    expect(next).toBeCalledWith({ type: 'TEST2' });
    expect(next).toBeCalledWith({ type: 'TEST3' });
});
