import {LngLatLike} from "mapbox-gl";
import {FeatureCollection, LineString} from "@turf/turf";
import {Office} from "../utils/models";

export interface PopupDataOffice {
  name: string
  coordinates: LngLatLike
  properties: Office
}

// Пример данных об маршруте. Не прокидывается сейчас.
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

// Круг показывающий в каких пределах ищем офисы
export interface CircleInputInfoLayer {
  color: string,
  radius: number,
  coordinates: number[]
}

export interface AppState {
  sidebarVisible: boolean;
  loaderVisible: boolean;
  popupOffice: PopupDataOffice | null,
  popupRoute: PopupDataRoute | null, // Custom info state (DEPRECATED)
  routeFeatures: LineString
  circleInputInfoLayer: CircleInputInfoLayer,
  routeInfo: any // API Mapbox info

}

export const appInitialState: AppState = {
  sidebarVisible: false,
  loaderVisible: false,
  popupOffice: null,
  popupRoute: null,
  routeFeatures: {
    type: "LineString",
    coordinates:[]
  },
  circleInputInfoLayer: {
    color:"",
    radius: 0,
    coordinates: []
  },
  routeInfo: null,
};
