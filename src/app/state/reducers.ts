import {createReducer, on} from '@ngrx/store';
import {appInitialState} from './states';
import * as Actions from './actions';
import {buildPopupRoute, setCircleLayerInfo, setFeaturesRoute} from './actions';

export const sidebarLoaderReducer = createReducer(
  appInitialState,
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
  on(Actions.buildPopupOffice, (state, { payload }) => {
    return({ ...state, popupOffice: payload })}),
  on(Actions.removePopups, (state) => ({
    ...state,
    popupOffice: null,
    popupRoute: null
  })),

  on(Actions.buildPopupRoute, (state, { payload }) => {
    return({ ...state, popupRoute: payload })}),

  on(Actions.setFeaturesRoute, (state, { payload }) => {
    console.log('setFeaturesRoute')
    return({ ...state, routeFeatures: payload })}),

  on(Actions.setCircleLayerInfo, (state, { payload }) => {
    return({ ...state, circleInputInfoLayer: payload })}),

  on(Actions.setRouteInfo, (state, { payload }) => {
    return({ ...state, routeInfo: payload })}),
);


