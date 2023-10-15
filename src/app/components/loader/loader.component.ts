import {Component, Input, OnInit} from '@angular/core';
import {selectLoaderVisible, selectPopupOData} from "../../state/selectors";
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

@Input("show") hasShown: boolean = false

  constructor(private store: Store) {
  }

ngOnInit(){
  this.store.select(selectLoaderVisible).subscribe(show => {
    console.log(show)

  })
}

}
