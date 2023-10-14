import {Injectable} from '@angular/core';
import mapboxgl, {LngLatLike, MapboxGeoJSONFeature} from 'mapbox-gl';
import {Office} from "../utils/models";
import {Point} from "@turf/helpers/dist/js/lib/geojson";
import {determineLoadCategory, determineWhenToGO, LoadCategory} from "../utils/loadFactor";
import {Store} from "@ngrx/store";
import {buildPopupOffice, removePopups} from "../state/actions";
import {PopupDataOffice} from "../state/states";

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private map: mapboxgl.Map = {} as mapboxgl.Map;

  constructor(private store: Store) {
    // Инициализация карты и другие настройки
  }

  setMap(map: mapboxgl.Map) {
    this.map = map
  }

  getMap(): mapboxgl.Map {
    return this.map;
  }




}
