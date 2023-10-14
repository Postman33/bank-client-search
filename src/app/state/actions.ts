import {createAction, props} from '@ngrx/store';

export const toggleSidebar = createAction('[SidebarLoader] Toggle Sidebar');
export const showLoader = createAction('[SidebarLoader] Show Loader');
export const hideLoader = createAction('[SidebarLoader] Hide Loader');


export const buildPopup = createAction('[Popup] Hide Loader', props<{ payload: any }>() );
export const removePopup = createAction('[Popup] Hide Loader');
