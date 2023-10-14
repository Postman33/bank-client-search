import {Component, OnInit, ViewChild} from '@angular/core';
import mapboxgl, {LngLatLike, MapboxGeoJSONFeature} from "mapbox-gl";
import {ScrollPanel} from "primeng/scrollpanel";
import {MapService} from "../../services/map.service";
import {Store} from "@ngrx/store";
import {buildPopup, removePopup, toggleSidebar} from "../../state/actions";
import {QueryService} from "../../services/query.service";
import {selectPopupData, selectRoadsData} from "../../state/selectors";
import {Point} from "@turf/helpers/dist/js/lib/geojson";
import {determineLoadCategory, determineWhenToGO, LoadCategory} from "../../utils/loadFactor";
import {Office} from "../../utils/models";
import {PopupData} from "../../state/states";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  map: mapboxgl.Map = {} as mapboxgl.Map;
  sidebarStatusIsActive = true;
  isMapLoaded = false
  popup!: mapboxgl.Popup | null;

  routesColors = [
    '#ff0000',
    '#0f2ef6',
    '#00ff06',
    '#ad05ff',
    '#ffc60a',
    '#0aebff',
    '#ff0aba',
  ]
  @ViewChild('scrollPanel') scrollPanel!: ScrollPanel;

  constructor(private mapService: MapService, private store: Store, private queryService: QueryService) {
  }

  ngOnInit() {

    let center = [37.6, 55.7] as LngLatLike
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center,
      zoom: 9,
      maxZoom: 19,
      accessToken: "pk.eyJ1IjoicG9zdG1hbjMzIiwiYSI6ImNrdXNxbGh4OTBxanMyd28yanB3eDM4eDEifQ.WrqvvPXOzXuqQMpfkNutCg",
    });

    // this.map.boxZoom.disable();
    // this.map.scrollZoom.disable();
    // this.map.dragRotate.disable();
    // this.map.dragPan.disable();
    // this.map.keyboard.disable();
    // this.map.doubleClickZoom.disable();
    // this.map.touchZoomRotate.disable();

    this.map.addControl(new mapboxgl.NavigationControl({}));




      this.store.select(selectPopupData).subscribe(popupData => {

      if (popupData === null) {
        this.popup?.remove();
        this.popup = null;
        return
      }

      if (this.popup) {
        this.popup.remove();
        this.popup = null;
      }

      if (popupData) {


        let dep_id = popupData.properties.id
        let hasRamp = popupData.properties.hasRamp ? "pi-check icon-green" : "pi-times icon-red"
        let rko = popupData.properties.rko ? "pi-briefcase icon-green" : "pi-times icon-red"

        let distance = popupData.properties.distance
        let station = popupData.properties.metroStation != null ?popupData.properties.metroStation : ""
          let stationIf = popupData.properties.metroStation != null ? "material-symbols-outlined icon-green" : "material-symbols-outlined icon-red"


        let dep_id2 = popupData.properties.id


        const popupContent = `<div class="popup-content">

        <div class="popup-title"><span class="material-symbols-outlined icon-green" style="position: relative; bottom: 0px;">account_balance</span>ОТДЕЛЕНИЕ № ${dep_id}</div>


    <div class="popup-section">
        <div><span class="${stationIf}" style="position: relative; top: 5px;">train</span>МЕТРО</div>
        ${station}
    </div>
    <div class="popup-section">
        <div><i class="pi ${hasRamp}"> ПАНДУС</i></div>
    </div>
    <div class="popup-section">
        <div><i class="pi ${rko}"> РКО</i></div>
    </div>
    <div class="popup-section">
        <div><i class="pi pi-clock icon-green"> 08:00 - 21:00</i> </div>
    </div>

${popupData.properties.whenToGo}<p>Load Factor: ${123}</p></div>`;
        let popup = new mapboxgl.Popup()
          .setLngLat(popupData.coordinates)
          .setHTML(popupContent)
        this.popup = popup.addTo(this.map);
      }
    });


    this.mapService.setMap(this.map);



    this.map.on("load", ()=> {
      this.isMapLoaded = true


      this.store.select(selectRoadsData).subscribe(featureCollection => {
        if (featureCollection.features.length == 0) return
        if (this.map.getLayer("roadLayer")) this.map.removeLayer("roadLayer")
        if (this.map.getLayer("startPointTextLayer")) this.map.removeLayer("startPointTextLayer")
        if (this.map.getLayer("startPointLayer")) this.map.removeLayer("startPointLayer")

        if (this.map.getSource("startPointSource")) this.map.removeSource("startPointSource")
        if (this.map.getSource("roadSource")) this.map.removeSource("roadSource")


        this.map.addSource('roadSource', {
          type: 'geojson',
          data: {
            type:"FeatureCollection",
            features: featureCollection.features as  any[]
          }
        });

        this.map.addLayer({
          id: 'roadLayer',
          type: 'line',
          source: 'roadSource',
          layout: {},
          paint: {
            'line-color': '#2bbae7', // или другой цвет по вашему выбору
            'line-width': 6
          }
        });

        let coords = (featureCollection.features[featureCollection.features.length - 1].geometry as Point).coordinates
        let coordsBank = (featureCollection.features[0].geometry as Point).coordinates

        const me = coords[coords.length - 1]
        // TODO: Check type
        // @ts-ignore
        let firstMe = me[0]
        // @ts-ignore
        let secondMe = me[1]


        const bank = coordsBank[0]
        // TODO: Check type
        // @ts-ignore
        let firstBank = bank[0]
        // @ts-ignore
        let secondBank = bank[1]

        this.mapService.getMap().addSource('startPointSource', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: "Feature",
                geometry: {
                  type: 'Point',
                  coordinates: [firstMe, secondMe]
                },
                properties: {
                  description: 'Я'
                }
              },
              {
                type: "Feature",
                geometry: {
                  type: 'Point',
                  coordinates: [firstBank, secondBank]
                },
                properties: {
                  description: 'Банк'
                }
              },


            ]
          }
        });


        this.mapService.getMap().addLayer({
          id: 'startPointLayer',
          type: 'circle',
          source: 'startPointSource',
          paint: {
            'circle-radius': 10,
            'circle-color': '#007cbf'
          }
        });

// Добавляем слой текста поверх точки начала маршрута
        this.mapService.getMap().addLayer({
          id: 'startPointTextLayer',
          type: 'symbol',
          source: 'startPointSource',
          layout: {
            'text-field': ['get', 'description'], // здесь мы используем данные из свойства 'description'
            'text-anchor': 'bottom',
            'text-offset': [0, -0.4] // поднимаем текст чуть выше круга для лучшей видимости
          },
          paint: {
            'text-color': '#000000'
          }
        });

      }) // Subscribe end

      // Подгрузка иконки.
      this.map.loadImage('assets/icons8-atm-96.png', (error, image) => {
        if (error) throw error;
        this.map.addImage('atm', image as ImageBitmap, {sdf: true});

        // Первичный показ офисов на карте в радиусе 45 км
        this.queryService.getOfficesInRadius((center as number[])[0], (center as number[])[1], 45).subscribe((data: any[]) => {
          if (!data) return
          this.addLayers(data)
        })


      });


    })


  }


  toggleSidebar() {
    this.store.dispatch(toggleSidebar());
  }

  showSidebar() {
  }

  hideSidebar() {
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
        // 'icon-allow-overlap': true,
        // 'symbol-sort-key': ['get', 'loadFactor'],
        'icon-size': {
          stops: [
            [10, 0.3],  // Меньший размер на низких уровнях масштабирования
            [18, 0.4]   // Больший размер на высоких уровнях масштабирования
          ]
        }
      },
      paint: {


        "icon-color": ['match', ['get', 'loadType'],
          LoadCategory.CRITICAL, '#c20606',
          LoadCategory.HIGH, '#c97408',
          LoadCategory.AVERAGE, '#b2bb07',
          LoadCategory.LOW, '#2c7c2e',
          '#0094fd'
        ],
        // 'icon-halo-color': 'rgba(0,0,0,0.22)', // Цвет свечения с альфа-каналом
        // 'icon-halo-width': 6, // Ширина свечения

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

        this.store.dispatch(buildPopup({payload: data}));

      }


      this.map.on('mouseleave', 'locations', (e) => {
        this.store.dispatch(removePopup());

      })
      // todo: почему оно вызывается на некоторых feature несколько раз?
      this.map.on('click', 'locations', (e) => {
        let features: MapboxGeoJSONFeature[] = this.map.queryRenderedFeatures(e.point, {layers: ["locations"]})
        let feature = (e.features as MapboxGeoJSONFeature[])[0]
        console.log(features)
        this.map.flyTo({

          center: (features[0].geometry as Point).coordinates as LngLatLike,
          duration: 1500,
          zoom: 18
        })


        console.log((feature.geometry as Point).coordinates)

      })

    });


  }

}
