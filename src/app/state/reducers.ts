import { createReducer, on } from '@ngrx/store';
import { initialSidebarLoaderState } from './states';
import * as SidebarLoaderActions from './actions';

export const sidebarLoaderReducer = createReducer(
  initialSidebarLoaderState,
  on(SidebarLoaderActions.toggleSidebar, (state) => ({
    ...state,
    sidebarVisible: !state.sidebarVisible
  })),
  on(SidebarLoaderActions.showLoader, (state) => ({
    ...state,
    loaderVisible: true
  })),
  on(SidebarLoaderActions.hideLoader, (state) => ({
    ...state,
    loaderVisible: false
  }))
);
