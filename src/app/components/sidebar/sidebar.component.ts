import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable} from "rxjs";
import {selectSidebarVisible} from "../../state/selectors";
import {buildPopup, setFeaturesRoute, toggleSidebar} from "../../state/actions";
import {MenuItem} from "primeng/api";
import {Frames} from "./frames";
import {AutoCompleteCompleteEvent} from "primeng/autocomplete";
import {QueryService} from "../../services/query.service";

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
  constructor(private store: Store, private queryService: QueryService) {
  }

  states =Frames // Импорт Enum

  sidbarVisible = false
  sidebarVisible$: Observable<boolean> = this.store.pipe(select(selectSidebarVisible));

  tabsItems: MenuItem[] | undefined;
  activeTab: MenuItem | undefined;
  suggestions: any;

  search(event: AutoCompleteCompleteEvent) {
    this.suggestions = [
      {name: 'Адрес 1', coordinates: '37.6156,55.7522'},
      {name: 'Адрес 2', coordinates: '36.6156,55.7522'},
    ];
    console.log(event)
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

  startQueryRoute() {
    //this.queryService.searchRoute()
    console.log(this.searchFilters.address)
    let [lat,lng] = (this.searchFilters?.address?.coordinates! as string).split(",")
    let res = this.queryService.searchRoute(+lat,+lng,2)
    res.subscribe( data => {
      console.log(data)
      this.store.dispatch(setFeaturesRoute({ payload: data }));



    })
  }
  test1: any;

  findedElements: any;

  showResponseSection: boolean = false;
  items: string[] = [];  // предположим, что это список ответов

  // вызывается при нажатии кнопки
  answers = [
    {text: 'Ответ 1'},
    {text: 'Ответ 2'},
    {text: 'Ответ 1'},
    {text: 'Ответ 2'},
    {text: 'Ответ 1'},
    {text: 'Ответ 2'},
    {text: 'Ответ 1'},
    {text: 'Ответ 2'},
    {text: 'Ответ 1'},
    {text: 'Ответ 2'},
    {text: 'Ответ 1'},
    {text: 'Ответ 2'},
    {text: 'Ответ 1'},
    {text: 'Ответ 2'},
    {text: 'Ответ 1'},
    {text: 'Ответ 2'},
    {text: 'Ответ 1'},
    {text: 'Ответ 2'},
    // ... другие ответы ...
  ];
  selectedAnswer: any = null;

  onButtonClick() {
    // Здесь вы можете добавить логику загрузки данных и присвоения их списку items
    // ...

    // Затем покажем секцию ответа
    this.showResponseSection = true;
  }

  onAnswerClick(answer: any) {
    // Если уже выбран, снимаем выделение
    if (this.selectedAnswer === answer) {
      this.selectedAnswer = null;
    } else {
      this.selectedAnswer = answer;
    }
    console.log("Вы нажали на:", answer.text);
  }
}
