import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from './states';

const featureSelector = createFeatureSelector<AppState>('appState');

export const selectSidebarVisible = createSelector(
  featureSelector,
  (state: AppState) => state.sidebarVisible
);

export const selectLoaderVisible = createSelector(
  featureSelector,
  (state: AppState) => state.loaderVisible
);

export const selectPopupData = createSelector(
  featureSelector,
  (mapState) => mapState.popup
);
