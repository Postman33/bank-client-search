import { createAction } from '@ngrx/store';

export const toggleSidebar = createAction('[SidebarLoader] Toggle Sidebar');
export const showLoader = createAction('[SidebarLoader] Show Loader');
export const hideLoader = createAction('[SidebarLoader] Hide Loader');
