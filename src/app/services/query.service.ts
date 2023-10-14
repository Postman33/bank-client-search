import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
let BASE= "http://localhost:3000"

@Injectable({
  providedIn: 'root'
})
export class QueryService {

  constructor(private http: HttpClient) { }

  getOfficesInRadius(lat: number, lng: number, radius: number): Observable<any[]>{

    return this.http.post<any[]>(BASE + "/office/search_in_box", {lat,lng,radius})

  }
}
