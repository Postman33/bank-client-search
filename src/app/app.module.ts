import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {MapComponent} from "./components/map/map.component";
import {SidebarModule} from "primeng/sidebar";
import {ScrollPanelModule} from "primeng/scrollpanel";
import {ButtonModule} from "primeng/button";
import {ProgressBarModule} from "primeng/progressbar";
import {TooltipModule} from "primeng/tooltip";
import {CardModule} from "primeng/card";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import { LoaderComponent } from './components/loader/loader.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { StoreModule } from '@ngrx/store';
import {sidebarLoaderReducer} from "./state/reducers";

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    LoaderComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    SidebarModule,
    ScrollPanelModule,
    ButtonModule,
    ProgressBarModule,
    TooltipModule,
    CardModule,
    BrowserAnimationsModule,
    ProgressSpinnerModule,
    StoreModule.forRoot({
      sidebarLoader: sidebarLoaderReducer
    })  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
