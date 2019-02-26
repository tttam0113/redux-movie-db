import { API_URL, API_KEY } from '../../../config';
import { CREDITS, FETCH_CREDITS } from '../../actions/credits';
import { API_SUCCESS, API_ERROR, apiRequest } from '../../actions/api';
import { setMovie } from '../../actions/movie';
import { setLoader } from '../../actions/ui';

const buildCreditUrl = movieId => `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`;

const creditsMiddleware = () => next => action => {
  next(action);

  switch (action.type) {
    case FETCH_CREDITS:
      next([
        apiRequest({
          method: 'GET',
          url: buildCreditUrl(action.payload.movieId),
          data: action.payload,
          feature: CREDITS,
        }),
        setLoader({ state: true, feature: CREDITS }),
      ]);
      break;
    case `${CREDITS} ${API_SUCCESS}`:
      const result = action.payload;
      const directors = result.crew.filter(member => member.job === 'Director');

      const { movie } = action.meta.data;
      const newState = {
        movie,
        directors,
        actors: result.cast,
      };

      next([setMovie({ data: newState }), setLoader({ state: false, feature: CREDITS })]);
      break;
    case `${CREDITS} ${API_ERROR}`:
      next(setLoader({ state: false, feature: CREDITS }));
      break;
    default:
      break;
  }
};

export default creditsMiddleware;
