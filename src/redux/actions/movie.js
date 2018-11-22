export const MOVIE = '[Movie]';

//action types

//action types for movie
export const FETCH_MOVIE = `${MOVIE} FETCH_MOVIE`;
export const SET_MOVIE = `${MOVIE} SET_MOVIE`;

export const CLEAR_MOVIE = `${MOVIE} CLEAR_MOVIE`;
export const SET_MOVIE_PERSISTED_STATE = `${MOVIE} SET_MOVIE_PERSISTED_STATE`;

// action creators
export const fetchMovie = ({ movieId }) => ({
    type: FETCH_MOVIE,
    payload: movieId,
    meta: { feature: MOVIE }
});

export const setMovie = ({ movie }) => ({
    type: SET_MOVIE,
    payload: movie,
    meta: { feature: MOVIE }
});

export const clearMovie = () => ({
    type: CLEAR_MOVIE
});

export const setMoviePersistedState = state => ({
    type: SET_MOVIE_PERSISTED_STATE,
    payload: state
});
