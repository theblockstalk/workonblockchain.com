import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService} from '../../../user.service';
import { Router } from '@angular/router';
import { HttpClient  } from '@angular/common/http';
import {filter_array} from '../../../../services/object';

@Component({
  selector: 'app-c-forme-dropdown-autosuggest',
  templateUrl: './dropdown-autosuggest.component.html',
  styleUrls: ['./dropdown-autosuggest.component.css']
})
export class DropdownAutosuggestComponent implements OnInit {
  @Input() placeholder: string;
  @Input() errorMsg: string;
  @Input() controllerOptions: object; //{countries: true/false}
  @Input() controller; // fn(text: string, options: {})
  @Input() displayItems; //fn(item: {})
  @Output() selectedItems : EventEmitter<Array<object>> = new EventEmitter<Array<object>>();
  selectedValueArray = [];
  textValue;
  optionValues = [];

  constructor(private authenticationService: UserService, private router: Router, private http: HttpClient) { }

  ngOnInit() {
  }

  autoSuggest() {
    if(this.textValue !== '') {
      this.controller(this.textValue, this.controllerOptions)
        .subscribe(data => {
            if (data) {
              this.optionValues = this.displayItems(data);
            }
          },
          error =>
          {
          });
    }
  }

  selectedValueAndData(inputValue) {
    if(this.optionValues) {
      const citiesExist = this.optionValues.find(x => x.name === inputValue);
      if(citiesExist) {
        this.textValue = '';
        this.selectedItems.emit(citiesExist);
      }
    }
  }


}
