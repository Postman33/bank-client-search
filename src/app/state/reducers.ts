import { createReducer, on } from '@ngrx/store';
import { appUnitialState } from './states';
import * as Actions from './actions';

export const sidebarLoaderReducer = createReducer(
  appUnitialState,
  on(Actions.toggleSidebar, (state) => ({
    ...state,
    sidebarVisible: !state.sidebarVisible
  })),
  on(Actions.showLoader, (state) => ({
    ...state,
    loaderVisible: true
  })),
  on(Actions.hideLoader, (state) => ({
    ...state,
    loaderVisible: false
  })),
  on(Actions.buildPopup, (state, { payload }) => {
    console.log('build')
    return({ ...state, popup: payload })}),

);
