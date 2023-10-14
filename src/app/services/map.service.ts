import {Injectable} from '@angular/core';
import mapboxgl, {LngLatLike, MapboxGeoJSONFeature} from 'mapbox-gl';
import {Office} from "../utils/models";
import {Point} from "@turf/helpers/dist/js/lib/geojson";
import {of} from "rxjs";
import {determineLoadCategory, determineWhenToGO, LoadCategory} from "../utils/loadFactor";
import {Store} from "@ngrx/store";
import {buildPopup, removePopup} from "../state/actions";
import {PopupData} from "../state/states";

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


  addLayers(data: any[]) {
    this.map.addSource('locations', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: data.map(function (office) {

        // TODO: Office type
          return {
            type: 'Feature',
            properties: {
              ...office,
              address: office.address,
              loadFactor: office.loadFactor,
              loadType: determineLoadCategory(office.loadFactor),
              whenToGo: determineWhenToGO(office.loadFactor),
            },
            geometry: office.location
          };
        })
      }
    });

    this.map.addLayer({
      id: 'locations',
      type: 'symbol',
      source: 'locations',
      layout: {
        'icon-image': ['match', ['get', 'loadFactor'],
          50, 'atm', // Если loadFactor > 50, используем красную иконку
          'atm' // Иначе используем синюю иконку
        ],

        'icon-size': {
          stops: [
            [10, 0.3],  // Меньший размер на низких уровнях масштабирования
            [18, 0.4]   // Больший размер на высоких уровнях масштабирования
          ]
        }
      },

      paint: {

        "icon-color": ['match', ['get', 'loadType'],
          LoadCategory.CRITICAL, '#ff0000',
          LoadCategory.HIGH, '#FF8C00',
          LoadCategory.AVERAGE, '#eeff00',
          LoadCategory.LOW, '#aafd00',
          '#0094fd'
        ],

      }

    });
    //this.map.setLayerZoomRange('locations', 7, 18)


    this.map.on('mouseenter', 'locations', (e) => {
      // Получите объект (feature) и его свойства
      if (e.features) {
        var feature = e.features[0] as MapboxGeoJSONFeature & { properties: Office };
        var address = feature.properties.address;
        var loadFactor = feature.properties.loadFactor;


        // Создайте HTML-содержимое для информационного окна


        // Показать информационное окно над объектом

        let data: PopupData = {
          name: "123",
          coordinates: (feature.geometry as Point).coordinates as LngLatLike,
          properties: feature.properties
        }

        this.store.dispatch(buildPopup({ payload: data }));

      }


      this.map.on('mouseleave', 'locations', (e) => {
        this.store.dispatch(removePopup());

      })


    });


  }

}
