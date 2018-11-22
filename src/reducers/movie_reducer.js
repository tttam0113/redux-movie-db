import {
    GET_MOVIE,
    SHOW_LOADING_SPINNER,
    CLEAR_MOVIE,
    SET_MOVIE_PERSISTED_STATE
} from '../actions';

const defaultState = {
    movie: null,
    actors: null,
    directors: [],
    loading: false
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case SET_MOVIE_PERSISTED_STATE:
            return {
                ...state,
                ...action.payload
            };
        case GET_MOVIE:
            return {
                ...state,
                movie: action.payload.movie,
                actors: action.payload.actors,
                loading: false,
                directors: action.payload.directors
            };
        case SHOW_LOADING_SPINNER:
            return {
                ...state,
                loading: true
            };
        case CLEAR_MOVIE:
            return {
                ...state,
                movie: null,
                actors: null,
                directors: null
            };
        default:
            return state;
    }
};
