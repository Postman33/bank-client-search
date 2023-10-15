import {createAction, props} from '@ngrx/store';
import {CircleInputInfoLayer} from "./states";

export const toggleSidebar = createAction('[SidebarLoader] Toggle Sidebar');
export const showLoader = createAction('[SidebarLoader] Show Loader');
export const hideLoader = createAction('[SidebarLoader] Hide Loader');


export const buildPopupOffice = createAction('[Popup]buildPopupOffice', props<{ payload: any }>() );
export const removePopups = createAction('[Popup] removePopups');

export const buildPopupRoute = createAction('[Popup]buildPopupRoute', props<{ payload: any }>() );


export const setFeaturesRoute = createAction('[Route] setFeaturesRoute', props<{ payload: any }>() );
export const setCircleLayerInfo = createAction('[Route] setCircleLayerInfo', props<{ payload: CircleInputInfoLayer }>() );
export const setRouteInfo = createAction('[Route] setRouteInfo', props<{ payload: any }>() );
