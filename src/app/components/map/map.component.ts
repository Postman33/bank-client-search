import {Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import mapboxgl from "mapbox-gl";
import * as turf from '@turf/turf';
import {LineString} from '@turf/turf';

import Graph from "graphology";
import {ScrollPanel} from "primeng/scrollpanel";
import {range} from "rxjs";
import {MapService} from "../../services/map.service";
import {Store} from "@ngrx/store";
import {showLoader, toggleSidebar} from "../../state/actions";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  map: mapboxgl.Map = {} as mapboxgl.Map;
  sidebarStatusIsActive = true;
  isMapLoaded = false

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

  constructor(private mapService: MapService, private store: Store) {
  }

  ngOnInit() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [37.6, 55.7],
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


    this.mapService.setMap(this.map);
    this.map.on("load", ()=>{
      this.isMapLoaded = true
    })

  }




  toggleSidebar() {
    this.store.dispatch(toggleSidebar());
    this.store.dispatch(showLoader());
  }

  showSidebar() {
  }

  hideSidebar() {
  }


}
