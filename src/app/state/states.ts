import {LngLatLike} from "mapbox-gl";
import {FeatureCollection} from "@turf/turf";
import {Office} from "../utils/models";

export interface PopupDataOffice {
  name: string
  coordinates: LngLatLike
  properties: Office
}
export interface RouteData {
  routeTime: string, // 12 min
  routeType: string, // Пеший или авто
  routeLength: number // длина маршрута в км
}
export interface PopupDataRoute {
  name: string
  coordinates: LngLatLike
  properties: Office & RouteData
}
export interface AppState {
  sidebarVisible: boolean;
  loaderVisible: boolean;
  popupOffice: PopupDataOffice | null,
  popupRoute: PopupDataRoute | null,
  routeFeatures: FeatureCollection


}

export const appInitialState: AppState = {
  sidebarVisible: false,
  loaderVisible: false,
  popupOffice: null,
  popupRoute: null,
  routeFeatures: {
    features: [],
    type: "FeatureCollection"
  }
};
