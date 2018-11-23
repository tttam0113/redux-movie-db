import {
    MOVIES,
    MORE_MOVIES,
    FETCH_POPULAR_MOVIES,
    SEARCH_MOVIES,
    LOAD_MORE_MOVIES,
    CLEAR_MOVIES,
    setMovies,
    setPopularPersistedState,
    clearMovies,
    setMoreMovies
} from '../../actions/movies';

import { API_ERROR, API_SUCCESS, apiRequest } from '../../actions/api';
import { setLoader } from '../../actions/ui';

import { API_URL, API_KEY } from '../../../config';

const buildPopularUrl = (page = 1) =>
    `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`;

const buildSearchUrl = (searchTerm, page) =>
    `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${searchTerm}&page=${page}`;

const moviesMiddleware = ({ dispatch }) => next => action => {
    next(action);

    switch (action.type) {
        case CLEAR_MOVIES:
            next(setMovies({ data: { results: [] } }));
            break;
        case FETCH_POPULAR_MOVIES: {
            if (sessionStorage.getItem('HomeState')) {
                const home = JSON.parse(sessionStorage.getItem('HomeState'));
                next(setPopularPersistedState(home));
            } else {
                dispatch(clearMovies());
                next([
                    apiRequest({
                        method: 'GET',
                        url: buildPopularUrl(action.payload.page),
                        feature: MOVIES
                    }),
                    setLoader({ state: true, feature: MOVIES })
                ]);
            }
            break;
        }
        case LOAD_MORE_MOVIES: {
            const { searchTerm, currentPage } = action.payload;
            const url = searchTerm
                ? buildSearchUrl(searchTerm, currentPage + 1)
                : buildPopularUrl(currentPage + 1);
            next([
                apiRequest({
                    data: searchTerm ? { searchTerm } : null,
                    method: 'GET',
                    url,
                    feature: MORE_MOVIES
                }),
                setLoader({ state: true, feature: MORE_MOVIES })
            ]);
            break;
        }
        case SEARCH_MOVIES: {
            const { searchTerm } = action.payload;
            const url = searchTerm
                ? buildSearchUrl(searchTerm, 1)
                : buildPopularUrl(1);

            next([
                clearMovies(),
                apiRequest({
                    data: searchTerm ? { searchTerm } : null,
                    method: 'GET',
                    url,
                    feature: MOVIES
                }),
                setLoader({ state: true, feature: MOVIES })
            ]);

            break;
        }
        case `${MOVIES} ${API_SUCCESS}`: {
            const { data: metaData } = action.meta;
            next([
                setMovies({ data: { ...action.payload, ...metaData } }),
                setLoader({ state: false, feature: MOVIES })
            ]);
            break;
        }
        case `${MORE_MOVIES} ${API_SUCCESS}`:
            next([
                setMoreMovies({ data: action.payload }),
                setLoader({ state: false, feature: MORE_MOVIES })
            ]);
            break;
        case `${MORE_MOVIES} ${API_ERROR}`:
            next([setLoader({ state: false, feature: MORE_MOVIES })]);
            break;
        case `${MOVIES} ${API_ERROR}`:
            next([setLoader({ state: false, feature: MOVIES })]);
            break;
        default:
            break;
    }
};

export default moviesMiddleware;
