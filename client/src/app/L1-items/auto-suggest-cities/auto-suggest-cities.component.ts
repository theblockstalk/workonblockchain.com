import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {UserService} from '../../user.service';
import {filter_array} from '../../../services/object';

@Component({
  selector: 'app-auto-suggest-cities',
  templateUrl: './auto-suggest-cities.component.html',
  styleUrls: ['./auto-suggest-cities.component.css']
})
export class AutoSuggestCitiesComponent implements OnInit {
  @Input() countriesVal;
  @Output() selectedItems : EventEmitter<any> = new EventEmitter<any>();
  controllerOptions: any = {};
  autoSuggestController;
  resultItemDisplay;
  selectedValue;
  selectedValueArray = [];
  error;
  constructor(private authenticationService : UserService) { }

  ngOnInit() {
    this.controllerOptions = {countries : this.countriesVal};
    this.autoSuggestController = function (textValue, controllerOptions) {
      return this.authenticationService.autoSuggestOptions(textValue, controllerOptions);
    }
    this.resultItemDisplay = function (data) {
      const citiesInput = data;
      let citiesOptions = [];
      for(let cities of citiesInput['locations']) {
        if(cities['remote'] === true) {
          citiesOptions.push({ name: 'Remote'});
        }
        if(cities['city']) {
          const cityString = cities['city'].city + ", " + cities['city'].country + " (city)";
          citiesOptions.push({_id : cities['city']._id , name : cityString});
        }
        if(cities['country'] ) {
          const countryString = cities['country']  + " (country)";
          if(citiesOptions.findIndex((obj => obj.name === countryString)) === -1)
            citiesOptions.push({name: countryString});
        }
      }
      return filter_array(citiesOptions);
    }
    this.selectedValue = function (inputValue, optionValues) {
      if(optionValues) {
        const citiesExist = optionValues.find(x => x.name === inputValue);
        if(citiesExist) {
          if(this.selectedValueArray.length > 9) {
            this.error = 'You can select maximum 10 locations';
            setInterval(() => {
              this.error = "" ;
            }, 5000);
          }
          else {
            if(this.selectedValueArray.find(x => x.name === inputValue)) {
              this.error = 'This location has already been selected';
              setInterval(() => {
                this.error = "" ;
              }, 4000);
            }
            else {
              if(citiesExist) this.selectedValueArray.push({_id:citiesExist._id ,  name: inputValue});
              else this.selectedValueArray.push({ name: inputValue});
            }
          }
        }
        if(this.selectedValueArray.length > 0) {
          this.selectedValueArray.sort(function(a, b){
            if(a.name < b.name) { return -1; }
            if(a.name > b.name) { return 1; }
            return 0;
          })
          if(this.selectedValueArray.find((obj => obj.name === 'Remote'))) {
            const remoteValue = this.selectedValueArray.find((obj => obj.name === 'Remote'));
            this.selectedValueArray.splice(0, 0, remoteValue);
            this.selectedValueArray = filter_array(this.selectedValueArray);
          }
          return this.selectedValueArray;
        }
      }
    }
  }

  itemSelected(data) {
    this.selectedItems.emit(data);
  }

}
