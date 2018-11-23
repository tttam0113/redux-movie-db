import { createSelector } from 'reselect';

export const getHomeState = state => state.home;
export const getHomeMovies = createSelector(
    getHomeState,
    home => home.movies
);

export const getHeroImage = createSelector(
    getHomeState,
    getHomeMovies,
    (home, homeMovies) =>
        home.heroImage
            ? home.heroImage
            : homeMovies && homeMovies.length > 0
            ? homeMovies[0]
            : null
);

