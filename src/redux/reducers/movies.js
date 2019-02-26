import { SET_MOVIES, SET_MORE_MOVIES, SET_POPULAR_PERSISTED_STATE } from '../actions/movies';

const inititalState = {
  movies: [],
  heroImage: null,
  currentPage: 0,
  totalPages: 0,
  searchTerm: '',
};

export default (state = inititalState, action) => {
  switch (action.type) {
    case SET_POPULAR_PERSISTED_STATE:
      return {
        ...state,
        ...action.payload,
      };
    case SET_MOVIES: {
      const { page, total_pages, results, searchTerm = '' } = action.payload;
      return {
        ...state,
        movies: results || [],
        currentPage: page,
        totalPages: total_pages,
        searchTerm: searchTerm,
      };
    }
    case SET_MORE_MOVIES: {
      const { page, total_pages, results } = action.payload;
      return {
        ...state,
        movies: [...state.movies, ...results],
        currentPage: page,
        totalPages: total_pages,
      };
    }
    default:
      return state;
  }
};
