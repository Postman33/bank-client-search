import {createFeatureSelector, createSelector} from '@ngrx/store';
import {AppState} from './states';

const featureSelector = createFeatureSelector<AppState>('appState');

export const selectSidebarVisible = createSelector(
  featureSelector,
  (state: AppState) => state.sidebarVisible
);

export const selectLoaderVisible = createSelector(
  featureSelector,
  (state: AppState) => state.loaderVisible
);

export const selectPopupOData = createSelector(
  featureSelector,
  (mapState) => mapState.popupOffice
);
export const selectPopupRData = createSelector(
  featureSelector,
  (mapState) => mapState.popupRoute
);

export const selectRoadsData = createSelector(
  featureSelector,
  (mapState) => mapState.routeFeatures
);
