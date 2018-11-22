export const CREDITS = '[Credits]';

export const FETCH_CREDITS = `${CREDITS} FETCH_CREDITS`; // command action

export const fetchCredits = ({ movieId }) => ({
    type: FETCH_CREDITS,
    payload: movieId,
    meta: { feature: CREDITS }
});
