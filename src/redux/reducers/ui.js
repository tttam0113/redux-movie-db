import { SET_LOADER } from '../actions/ui';

const initialState = {
    loading: false
};

export default (ui = initialState, action) => {
    switch (true) {
        case action.type.includes(SET_LOADER):
            return { ...ui, loading: action.payload };
        default:
            return ui;
    }
};
