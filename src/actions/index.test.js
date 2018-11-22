import * as actions from './index';

test('should setup showLoadingSpinner action object', () => {
    const action = actions.showLoadingSpinner();
    expect(action.type).toEqual(actions.SHOW_LOADING_SPINNER);
});

test('should setup clearMovie action object', () => {
    const action = actions.clearMovie();
    expect(action.type).toEqual(actions.CLEAR_MOVIE);
})