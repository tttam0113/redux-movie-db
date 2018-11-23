import { createSelector } from 'reselect';

export const getMovieState = state => state.movie;

export const getActors = createSelector(
    getMovieState,
    movie => movie.actors
);

export const getDirectors = createSelector(
    getMovieState,
    movie => movie.directors
);