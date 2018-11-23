import { API_URL, API_KEY } from '../../../config';
import {
    MOVIE,
    FETCH_MOVIE,
    CLEAR_MOVIE,
    setMovie,
    clearMovie,
    setMoviePersistedState
} from '../../actions/movie';
import { API_SUCCESS, API_ERROR, apiRequest } from '../../actions/api';
import { setLoader } from '../../actions/ui';

import { fetchCredits } from '../../actions/credits';

const buildMovieUrl = movieId =>
    `${API_URL}movie/${movieId}?api_key=${API_KEY}&language=en-US`;

const movieMiddleware = ({ dispatch }) => next => action => {
    next(action);

    switch (action.type) {
        case CLEAR_MOVIE:
            next(
                setMovie({
                    data: { movie: null, actors: null, directors: [] }
                })
            );
            break;
        case FETCH_MOVIE: {
            const movieId = action.payload;
            if (sessionStorage.getItem(`${movieId}`)) {
                const movie = JSON.parse(sessionStorage.getItem(`${movieId}`));
                next(setMoviePersistedState(movie));
            } else {
                dispatch(clearMovie());
                next([
                    apiRequest({
                        method: 'GET',
                        url: buildMovieUrl(movieId),
                        data: { movieId },
                        feature: MOVIE
                    }),
                    setLoader({ state: true, feature: MOVIE })
                ]);
            }
            break;
        }
        case `${MOVIE} ${API_SUCCESS}`: {
            if (action.payload.status_code) {
                next([
                    clearMovie(),
                    setLoader({ state: false, feature: MOVIE })
                ]);
            } else {
                const { movieId } = action.meta.data;
                const movie = action.payload;
                next(fetchCredits({ movieId, movie }));
            }
            break;
        }
        case `${MOVIE} ${API_ERROR}`:
            next(setLoader({ state: false, feature: MOVIE }));
            break;
        default:
            break;
    }
};

export default movieMiddleware;
