import mapboxgl, {LngLatLike, Point} from "mapbox-gl";
import {Feature, FeatureCollection} from "@turf/turf";
export interface PopupData {
  name: string
  coordinates: LngLatLike
  properties: any,

}

export interface AppState {
  sidebarVisible: boolean;
  loaderVisible: boolean;
  popup: PopupData | null,
  routeFeatures: FeatureCollection


}

export const appUnitialState: AppState = {
  sidebarVisible: false,
  loaderVisible: false,
  popup: null,
  routeFeatures: {
    features:[],
    type:"FeatureCollection"
  }
};
