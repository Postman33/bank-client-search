import { createReducer, on } from '@ngrx/store';
import { appUnitialState } from './states';
import * as Actions from './actions';
import {removePopup, setFeaturesRoute} from "./actions";

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
  on(Actions.removePopup, (state) => ({
    ...state, popup: null
  })),
  on(Actions.setFeaturesRoute, (state, { payload }) => {
    console.log('setFeaturesRoute')
    return({ ...state, routeFeatures: payload })}),
);
