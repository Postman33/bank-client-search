import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
let BASE= "http://localhost:3000"

@Injectable({
  providedIn: 'root'
})
export class QueryService {

  constructor(private http: HttpClient) { }

  getOfficesInRadius(lat: number, lng: number, radius: number){

    return this.http.post(BASE + "/office/search_in_box", {lat,lng,radius})

  }
}
