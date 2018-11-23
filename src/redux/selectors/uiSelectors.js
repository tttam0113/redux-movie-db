import { createSelector } from 'reselect';

export const getUiState = state => state.ui;

export const getLoading = createSelector(
    getUiState,
    ui => ui.loading
);
