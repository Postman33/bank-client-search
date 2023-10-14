import mapboxgl, {LngLatLike, Point} from "mapbox-gl";
export interface PopupData {

  name: string
  coordinates: LngLatLike
  properties: any

}

export interface AppState {
  sidebarVisible: boolean;
  loaderVisible: boolean;
  popup: PopupData | null

}

export const appUnitialState: AppState = {
  sidebarVisible: false,
  loaderVisible: false,
  popup: null
};
