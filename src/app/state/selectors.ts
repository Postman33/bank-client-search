import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SidebarLoaderState } from './states';

const selectSidebarLoaderState = createFeatureSelector<SidebarLoaderState>('sidebarLoader');

export const selectSidebarVisible = createSelector(
  selectSidebarLoaderState,
  (state: SidebarLoaderState) => state.sidebarVisible
);

export const selectLoaderVisible = createSelector(
  selectSidebarLoaderState,
  (state: SidebarLoaderState) => state.loaderVisible
);
