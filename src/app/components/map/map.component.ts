import {Component, OnInit, ViewChild} from '@angular/core';
import mapboxgl, {LngLatLike, MapboxGeoJSONFeature} from "mapbox-gl";
import {ScrollPanel} from "primeng/scrollpanel";
import {MapService} from "../../services/map.service";
import {Store} from "@ngrx/store";
import {buildPopupOffice, buildPopupRoute, removePopups, toggleSidebar} from "../../state/actions";
import {QueryService} from "../../services/query.service";
import {
  selectCircleInfo,
  selectPopupOData,
  selectPopupRData,
  selectRoadsData,
  selectRouteInfo
} from "../../state/selectors";
import {Point} from "@turf/helpers/dist/js/lib/geojson";
import {determineLoadCategory, determineWhenToGO, LoadCategory} from "../../utils/loadFactor";
import {Office} from "../../utils/models";
import {PopupDataOffice} from "../../state/states";
import * as turf from '@turf/turf';

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

    // Подписка на сборку popup office type
    this.store.select(selectPopupOData).subscribe(popupData => {
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
    // Route data

    // Подписка на сборку popup route type
    // Показ информации о маршруте
    this.store.select(selectPopupRData).subscribe(popupData => {
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
        const popupContent = `<div class="popup-content">

    <div class="popup-section">
        <div style="display: flex; flex-direction: row; align-content: center; align-items: center">
        <span class="material-symbols-outlined" style="font-size: 12px">moving</span>
        <i class="pi" style="margin-left: 13px;"> РАССТОЯНИЕ</i>
        </div>
        <span>1.2 км</span>
    </div>
    <div class="popup-section" style="margin-bottom: 0">
        <div><i class="pi pi-clock"> ВРЕМЯ ПУТИ</i></div>
        <span>~ 14 минут</span>
    </div>
${popupData.properties.whenToGo}<p>Load Factor: ${123}</p></div>`;
        let popup = new mapboxgl.Popup()
          .setLngLat(popupData.coordinates)
          .setHTML(popupContent)
        this.popup = popup.addTo(this.map);
      }
    });

    this.mapService.setMap(this.map);

    this.map.on("load", () => {
      this.isMapLoaded = true



      // Создание слоев CIRCLE. Визуализация
      this.store.select(selectCircleInfo).subscribe(circleData => {
        if (circleData.coordinates.length <= 0) return
        if (this.map.getLayer("circleLayerFILL")) this.map.removeLayer("circleLayerFILL")
        if (this.map.getLayer("circleLayerCIRCLE")) this.map.removeLayer("circleLayerCIRCLE")

        if (this.map.getSource("circleSource")) this.map.removeSource("circleSource")


        const circle = turf.circle(circleData.coordinates, circleData.radius, {steps: 100, units: 'kilometers'});

        const features = this.map.queryRenderedFeatures(undefined,{ layers: ['locations'] });
        const featuresInsideCircle = features.filter(feature => {
          return turf.booleanPointInPolygon((feature.geometry as Point).coordinates, circle);
        })
        const idsInsideCircle = featuresInsideCircle.map(feature => {
          return (feature.properties as any).id ;
        });
        console.log(idsInsideCircle)
        const conditions = idsInsideCircle.map(id => ['==', ['get', 'id'], id]);
        const filter = ['any', ...conditions];
        //this.map.setFilter('locations', filter);



        // Добавляем источник данных с созданным кругом
        this.map.addSource('circleSource', {
          type: 'geojson',
          data: circle
        });


        this.mapService.getMap().addLayer({
          id: 'circleLayerFILL',
          type: 'fill',
          source: 'circleSource',
          paint: {
            'fill-color': 'rgba(11,159,239,0.23)'
          }
        });
        this.mapService.getMap().addLayer({
          id: 'circleLayerCIRCLE',
          type: 'circle',
          source: 'circleSource',
          paint: {
            'circle-color': 'rgb(11,159,239)'
          }
        });

      })



      // Создание слоев и источников для визуалзации дорог
      this.store.select(selectRoadsData).subscribe(lineString => {
        if (lineString == null || lineString.coordinates.length == 0) return
        if (this.map.getLayer("roadLayer")) this.map.removeLayer("roadLayer")
        if (this.map.getLayer("startPointTextLayer")) this.map.removeLayer("startPointTextLayer")
        if (this.map.getLayer("startPointLayer")) this.map.removeLayer("startPointLayer")

        if (this.map.getSource("startPointSource")) this.map.removeSource("startPointSource")
        if (this.map.getSource("roadSource")) this.map.removeSource("roadSource")


        this.map.addSource('roadSource', {
          type: 'geojson',
          data: lineString
        });



        this.map.addLayer({
          id: 'roadLayer',
          type: 'line',
          source: 'roadSource',
          layout: {},
          paint: {
            'line-color': '#2bbae7', // или другой цвет по вашему выбору
            'line-width': 12
          }
        });

        // Сборка popup при наведении на слой дорог
        this.map.on('mouseenter', 'roadLayer', (e) => {
          if (e.features) {
            console.log(e.features)

            this.store.select(selectRouteInfo).subscribe(data => {
              if (data && data.bank_info == null) {
                return
              }


              let dt: PopupDataOffice = {
                name: "123",
                coordinates: this.map.unproject(e.point),
                properties: data.bank_info
              }

              this.store.dispatch(buildPopupRoute({payload: dt}));
            })
          }
        })

        this.map.on('mouseleave', 'roadLayer', (e) => {
          this.store.dispatch(removePopups());
        })

        let coords = (lineString.coordinates[0])
        let coordsBank = lineString.coordinates[lineString.coordinates.length - 1]
          console.log(lineString)

          console.log(coordsBank)
          console.log(coords)
        // TODO: Check type
        // @ts-ignore
        let firstMe = coords[0]
        // @ts-ignore
        let secondMe = coords[1]


        // TODO: Check type
        // @ts-ignore
        let firstBank = coordsBank[0]
        // @ts-ignore
        let secondBank = coordsBank[1]

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
        this.queryService.getOfficesInRadius((center as number[])[0], (center as number[])[1], 22).subscribe((data: any[]) => {
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

  // Слои и источники для отделений банка
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

      }

    });

    //this.map.setLayerZoomRange('locations', 7, 18)

    // Dispatch на сборку popup для показа инфы об отделениях
    this.map.on('mouseenter', 'locations', (e) => {
      // Получите объект (feature) и его свойства
      if (e.features) {
        var feature = e.features[0] as MapboxGeoJSONFeature & { properties: Office };
        var address = feature.properties.address;
        var loadFactor = feature.properties.loadFactor;

        let data: PopupDataOffice = {
          name: "123",
          coordinates: (feature.geometry as Point).coordinates as LngLatLike,
          properties: feature.properties
        }

        this.store.dispatch(buildPopupOffice({payload: data}));

      }


      this.map.on('mouseleave', 'locations', (e) => {
        this.store.dispatch(removePopups());

      })

    });

    // todo: почему оно вызывается на некоторых feature несколько раз?
    this.map.on('click', 'locations', (e) => {
      let features: MapboxGeoJSONFeature[] = this.map.queryRenderedFeatures(e.point, {layers: ["locations"]})
      let feature = (e.features as MapboxGeoJSONFeature[])[0]
      this.map.flyTo({

        center: (features[0].geometry as Point).coordinates as LngLatLike,
        duration: 1500,
        zoom: 18
      })



    })


  }

}
