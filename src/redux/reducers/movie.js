import { SET_MOVIE, SET_MOVIE_PERSISTED_STATE } from '../actions/movie';

const defaultState = {
  movie: null,
  actors: null,
  directors: [],
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case SET_MOVIE:
    case SET_MOVIE_PERSISTED_STATE:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
