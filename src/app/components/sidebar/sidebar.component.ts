import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable} from "rxjs";
import {selectSidebarVisible} from "../../state/selectors";
import {toggleSidebar} from "../../state/actions";
import {MenuItem} from "primeng/api";
import {Frames} from "./frames";
import {AutoCompleteCompleteEvent} from "primeng/autocomplete";

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
  constructor(private store: Store) {
  }

  states =Frames // Импорт Enum

  sidbarVisible = false
  sidebarVisible$: Observable<boolean> = this.store.pipe(select(selectSidebarVisible));

  tabsItems: MenuItem[] | undefined;
  activeTab: MenuItem | undefined;
  suggestions: any;

  search(event: AutoCompleteCompleteEvent) {
    this.suggestions = [...Array(10).keys()].map(item => event.query + '-' + item);
  }

  // ФОРМА
  selectedType : TypeService = {name:"", code:""} // тип обслуживания
  searchFilters = {
    rko: false,
    hasRamp: undefined,
    loadType: undefined,
    suoAvailability: undefined,
    officeType: undefined,
    kilometers: 1,
    address: undefined
  }

  officeTypes: any[] = [
    {label: 'Type 1', value: 'Type1'},
    {label: 'Type 2', value: 'Type2'},
    // ... Add other types
  ];

  ngOnInit(): void {
    this.sidebarVisible$.subscribe(visible => {
      //this.sidebarVisible = visible;
      console.log('1232')
      if (!this.sidbarVisible && !visible){
        this.sidbarVisible = true
        return
      } //TODO: check
      this.sidbarVisible = visible




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
      { label: 'Список банкоматов',id:this.states.B,  icon: 'pi pi-fw pi-calendar' },
      { label: 'Список отделений',id:this.states.C,  icon: 'pi pi-fw pi-pencil' },
    ];

    this.activeTab = this.tabsItems[0];

  }

  toggleSidebarMethod() {
    this.store.dispatch(toggleSidebar());
    this.sidbarVisible = false
  }


  protected readonly toggleSidebar = toggleSidebar;
  searchOfficeOptions: TypeService[] = [
    {name:"", code:""},
    {name:"", code:""},
    {name:"", code:""},
    {name:"", code:""}
  ];

}
