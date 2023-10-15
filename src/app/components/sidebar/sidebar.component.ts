import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable, switchMap} from "rxjs";
import {selectSidebarVisible} from "../../state/selectors";
import {setCircleLayerInfo, setFeaturesRoute, setRouteInfo, toggleSidebar} from "../../state/actions";
import {MenuItem} from "primeng/api";
import {Frames} from "./frames";
import {AutoCompleteCompleteEvent} from "primeng/autocomplete";
import {QueryService} from "../../services/query.service";
import {FeatureCollection, LineString} from '@turf/turf';
import {MapService} from "../../services/map.service";
import {HttpClient} from "@angular/common/http";
import {LngLatBoundsLike} from "mapbox-gl";
import * as turf from '@turf/turf';

// Тип обслуживания
interface TypeService {
  name: string;
  code: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  constructor(private store: Store, private queryService: QueryService, private mapService: MapService,
              private http: HttpClient) {
  }

  states = Frames // Импорт Enum

  sidebarVisible = false
  sidebarVisible$: Observable<boolean> = this.store.pipe(select(selectSidebarVisible));

  tabsItems: MenuItem[] | undefined;
  activeTab: MenuItem | undefined;
  suggestions: any;

  search(event: AutoCompleteCompleteEvent) {
    this.suggestions = [
      {name: 'Москва', coordinates: '37.6156,55.7522'},
      {name: 'Москва', coordinates: '37.60883424770236, 55.749154729118544'},
      {name: 'Москва', coordinates: '37.40883424770236, 55.749154729118544'},
    ];
  }

  selectedType : TypeService = {name:"", code:""} // тип обслуживания
  searchFilters = {
    rko: false,
    hasRamp: undefined,
    loadType: undefined,
    suoAvailability: undefined,
    officeType: undefined,
    kilometers: 1,
    address: {
      name: "",
      coordinates:""
    }
  }

  officeTypes: any[] = [
    {label: 'Type 1', value: 'Type1'},
    {label: 'Type 2', value: 'Type2'},
    // ... Add other types
  ];

  ngOnInit(): void {
    this.sidebarVisible$.subscribe(visible => {
      //this.sidebarVisible = visible;
      if (!this.sidebarVisible && !visible){
        this.sidebarVisible = true
        return
      } //TODO: check
      this.sidebarVisible = visible

        this.searchOfficeOptions = [
          { name: 'М', code: 'NY' },
          { name: 'Rome', code: 'RM' },
          { name: 'London', code: 'LDN' },
          { name: 'Istanbul', code: 'IST' },
          { name: 'Paris', code: 'PRS' }
        ];

    });


    this.tabsItems = [
      { label: 'Поиск отделений',id:this.states.SearchOffice, icon: 'pi pi-fw pi-home' },
      { label: 'ИИ-помощник',id:this.states.B,  icon: 'pi pi-fw pi-reddit' },
      { label: 'Список отделений',id:this.states.C,  icon: 'pi pi-fw pi-pencil' },
    ];

    this.activeTab = this.tabsItems[0];
  }

  toggleSidebarMethod() {
    this.store.dispatch(toggleSidebar());
    this.sidebarVisible = false
  }

  protected readonly toggleSidebar = toggleSidebar;
  searchOfficeOptions: TypeService[] = [
    {name:"", code:""},
    {name:"", code:""},
    {name:"", code:""},
    {name:"", code:""}
  ];

  startQueryRoute() {
    //this.queryService.searchRoute()
    console.log(this.searchFilters.address)
    let [lat, lng] = (this.searchFilters?.address?.coordinates! as string).split(",")
    this.queryService.searchRoute(+lat, +lng, 2).pipe(
      switchMap((response: FeatureCollection) => {

        this.store.dispatch(setRouteInfo({payload: response}));
        let start = response.features[response.features.length - 1]
        let end = response.features[0]
        let coords = []
        coords.push([(start.geometry as LineString).coordinates[0][0], (start.geometry as LineString).coordinates[0][1]]);
        coords.push([(end.geometry as LineString).coordinates[0][0], (end.geometry as LineString).coordinates[0][1]]);

        const coordinates = coords.join(';');
        const mapboxDirectionsURL = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?geometries=geojson&access_token=pk.eyJ1IjoicG9zdG1hbjMzIiwiYSI6ImNrdXNxbGh4OTBxanMyd28yanB3eDM4eDEifQ.WrqvvPXOzXuqQMpfkNutCg`;
        console.log(mapboxDirectionsURL)
        // "https://api.mapbox.com/directions/v5/
        // mapbox/driving/-122.39636,37.79129;-122.39732,37.79283;-122.39606,37.79349?annotations=maxspeed&overview=full&geometries=geojson&access_token=pk.eyJ1IjoicG9zdG1hbjMzIiwiYSI6ImNrdXNxbGh4OTBxanMyd28yanB3eDM4eDEifQ.WrqvvPXOzXuqQMpfkNutCg"

        return this.http.get<any>(mapboxDirectionsURL);
      })
    ).subscribe(data => {
      let geom = data.routes[0].geometry
      this.store.dispatch(setFeaturesRoute({ payload: geom }))
      const bbox = turf.bbox(geom);
      this.mapService.getMap().fitBounds(bbox as LngLatBoundsLike, {
        duration: 2000,
        zoom: 15
      })
    })
  }
  test1: any;

  changeFn($event: Event) {
    this.store.dispatch(setCircleLayerInfo({
      payload: {
        coordinates: this.searchFilters.address.coordinates.split(",").map(f => +f),
        radius: +$event,
        color: "#f30f0f"
      }
    }));
  }
}
