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
import {FormsModule} from "@angular/forms";
import {InputTextareaModule} from "primeng/inputtextarea";
import {TabMenuModule} from "primeng/tabmenu";
import {HttpClientModule} from "@angular/common/http";
import {RouterModule} from "@angular/router";
import {DropdownModule} from "primeng/dropdown";
import {CheckboxModule} from "primeng/checkbox";
import {InputSwitchModule} from "primeng/inputswitch";
import {InputTextModule} from "primeng/inputtext";
import {InputNumberModule} from "primeng/inputnumber";
import {AutoCompleteModule} from "primeng/autocomplete";
import {ListboxModule} from "primeng/listbox";

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
      appState: sidebarLoaderReducer
    }),
    FormsModule,
    InputTextareaModule,
    TabMenuModule,
    RouterModule.forRoot([]),
    DropdownModule,
    HttpClientModule,
    CheckboxModule,
    InputSwitchModule,
    InputTextModule,
    InputNumberModule,
    AutoCompleteModule,
    ListboxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
