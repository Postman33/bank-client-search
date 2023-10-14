import {Point} from "mapbox-gl";

export interface Office {

  id: number;

  salePointName: string;

  address: string;

  status: string;

  rko: string;

  officeType: string;

  salePointFormat: string;

  suoAvailability: boolean;

  hasRamp: boolean;

  location: Point;

  metroStation: string;

  distance: number;

  kep: boolean;

  myBranch: boolean;

  loadFactor: number;


  // кастомные поля
  loadType: string

  whenToGo: any;

}
