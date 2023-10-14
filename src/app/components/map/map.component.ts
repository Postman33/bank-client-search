import {Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import mapboxgl, {LngLatLike} from "mapbox-gl";
import * as turf from '@turf/turf';
import {Feature, FeatureCollection, GeoJSONObject, Geometry, LineString} from '@turf/turf';

import Graph from "graphology";
import {ScrollPanel} from "primeng/scrollpanel";
import {range} from "rxjs";
import {MapService} from "../../services/map.service";
import {Store} from "@ngrx/store";
import {showLoader, toggleSidebar} from "../../state/actions";
import {QueryService} from "../../services/query.service";
import {selectFeatureCollection, selectPopupData} from "../../state/selectors";
import {Point} from "@turf/helpers/dist/js/lib/geojson";

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



    this.map.on("load", ()=>{
      this.isMapLoaded = true



      this.store.select(selectFeatureCollection).subscribe(featureCollection => {
        console.log(featureCollection)
        if (this.map.getLayer("roadLayer")) this.map.removeLayer("roadLayer")

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
            'line-color': '#888888', // или другой цвет по вашему выбору
            'line-width': 4
          }
        });



      })



      this.map.loadImage('assets/icons8-atm-96.png', (error, image) => {
        if (error) throw error;
        // add image to the active style and make it SDF-enabled
        // @ts-ignore
        this.map.addImage('atm', image, { sdf: true});

        this.queryService.getOfficesInRadius((center as number[])[0],(center as number[])[1],45).subscribe((data: any[])=>{

          console.log('DATA')
          console.log(data)
          this.mapService.addLayers(data)
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


}
