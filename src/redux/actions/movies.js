export const MOVIES = '[Movies]';
export const MORE_MOVIES = '[MoreMovies]'

export const FETCH_POPULAR_MOVIES = `${MOVIES} FETCH_POPULAR_MOVIES`; // Command action
export const SEARCH_MOVIES = `${MOVIES} SEARCH_MOVIES`; // Command action
export const LOAD_MORE_MOVIES = `${MORE_MOVIES} LOAD_MORE_MOVIES`; // Command action
export const CLEAR_MOVIES = `${MOVIES} CLEAR_MOVIES`; // Command action

export const SET_MOVIES = `${MOVIES} SET_MOVIES`; // document action
export const SET_MORE_MOVIES = `${MORE_MOVIES} SET_MORE_MOVIES`; // document action

// action creator
export const fetchPopularMovies = ({ page = 1 }) => ({
    type: FETCH_POPULAR_MOVIES,
    payload: { page },
    meta: { feature: MOVIES }
});

export const searchMovies = ({ searchTerm }) => ({
    type: SEARCH_MOVIES,
    payload: { searchTerm },
    meta: { feature: MOVIES }
});

export const loadMoreMovies = ({ searchTerm, currentPage }) => ({
    type: LOAD_MORE_MOVIES,
    payload: { searchTerm, currentPage },
    meta: { feature: MORE_MOVIES }
});

export const clearMovies = () => ({
    type: CLEAR_MOVIES,
    payload: null,
    meta: { feature: MOVIES }
});

export const setMovies = ({ data }) => ({
    type: SET_MOVIES,
    payload: data,
    meta: { feature: MOVIES }
});

export const setMoreMovies = ({ data }) => ({
    type: SET_MORE_MOVIES,
    payload: data,
    meta: { feature: MORE_MOVIES }
});