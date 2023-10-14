import {Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import mapboxgl, {LngLatLike} from "mapbox-gl";
import * as turf from '@turf/turf';
import {LineString} from '@turf/turf';

import Graph from "graphology";
import {ScrollPanel} from "primeng/scrollpanel";
import {range} from "rxjs";
import {MapService} from "../../services/map.service";
import {Store} from "@ngrx/store";
import {showLoader, toggleSidebar} from "../../state/actions";
import {QueryService} from "../../services/query.service";
import {selectPopupData} from "../../state/selectors";
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
      maxZoom: 13,
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
      console.log(popupData)



      if (this.popup) {
        this.popup.remove();
        this.popup = null;
      }

      if (popupData) {
        console.log(popupData)
        var popupContent = `<h3>${popupData.properties.whenToGo}</h3><p>Load Factor: ${123}</p>`;
        let popup = new mapboxgl.Popup()
          .setLngLat(popupData.coordinates)
          .setHTML(popupContent)
        this.popup = popup.addTo(this.map);
      }
    });

    this.mapService.setMap(this.map);
    this.map.on("load", ()=>{
      this.isMapLoaded = true


      this.map.loadImage('assets/icons8-atm-96.png', (error, image) => {
        if (error) throw error;
        // add image to the active style and make it SDF-enabled
        // @ts-ignore
        this.map.addImage('atm', image, { sdf: true});

        this.queryService.getOfficesInRadius((center as number[])[0],(center as number[])[1],10).subscribe((data: any[])=>{

          console.log('DATA')
          console.log(data)
          this.mapService.addLayers(data)
        })


      });


    })


  }




  toggleSidebar() {
    this.store.dispatch(toggleSidebar());
    //this.store.dispatch(showLoader());
  }

  showSidebar() {
  }

  hideSidebar() {
  }


}
