import { Component, OnInit, Input, Output, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
import { UserService} from '../../../user.service';
import {filter_array, removeDuplication} from '../../../../services/object';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-i-forme-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {
  @Input() selectedLocation: Array<object>;
  errorMsg: string;
  @Output() selectedItems: EventEmitter<any> = new EventEmitter<any>();
  controllerOptions: any = {};
  autoSuggestController;
  resultItemDisplay;
  object;
  constructor(public authenticationService: UserService, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    if(this.selectedLocation) {
      this.changeLocationDisplayFormat(this.selectedLocation);
    }
    else this.selectedLocation = [];
    // this.controllerOptions = {countries : true}; i changed it due to endpoint issue
    this.controllerOptions = true;
    this.autoSuggestController = function (textValue, controllerOptions) {
      return this.authenticationService.autoSuggestOptions(textValue, controllerOptions);
    }
    //console.log(this.autoSuggestController);
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
  }

  selfValidate() {
    if(this.selectedLocation && this.selectedLocation.length <= 0) {
      this.errorMsg = "Please select atleast one location";
      return false;
    }
    if(!this.selectedLocation) {
      this.errorMsg = "Please select atleast one location";
      return false;
    }

    delete this.errorMsg;
    return true;
  }

    itemSelected(locationObj) {
    this.object = locationObj;
    if(this.selectedLocation.length > 9) {
      this.errorMsg = 'You can select maximum 10 locations';
      return false;
      if (isPlatformBrowser(this.platformId)) {
        setInterval(() => {
          delete this.errorMsg;
          return true;
        }, 3000);
      }
    }
    else {
      if(this.selectedLocation.find(x => x['name'] === locationObj.name)) {
        this.errorMsg = 'This location has already been selected';
        return false;
        if (isPlatformBrowser(this.platformId)) {
          setInterval(() => {
            delete this.errorMsg;
            return true;
          }, 3000);
        }
      }
      else {
        if(locationObj) this.selectedLocation.push({_id:locationObj._id ,  name: locationObj.name, visa_needed: false});
        else this.selectedLocation.push({ name: locationObj.name, visa_needed: false});
      }
    }
    if(this.selectedLocation.length > 0) {
      this.selectedLocation.sort(function(a, b){
        if(a['name'] < b['name']) { return -1; }
        if(a['name'] > b['name']) { return 1; }
        return 0;
      })
      if(this.selectedLocation.find((obj => obj['name'] === 'Remote'))) {
        let remoteValue = this.selectedLocation.find((obj => obj['name'] === 'Remote'));
        this.selectedLocation.splice(0, 0, remoteValue);
        this.selectedLocation = filter_array(this.selectedLocation);
      }
    }
    this.selectedItems.emit(this.selectedLocation);
    this.selfValidate();
  }

  deleteRow(index) {
    this.selectedLocation.splice(index, 1);
    this.selectedItems.emit(this.selectedLocation);
    this.selfValidate();
  }

  updateCitiesOptions(event) {
    let objIndex = this.selectedLocation.findIndex((obj => obj['name'] === event.target.value));
    this.selectedLocation[objIndex]['visa_needed'] = event.target.checked;
    this.selectedItems.emit(this.selectedLocation);
  }

  changeLocationDisplayFormat(array) {
    let locationArray = [];
    if(array)
    {
      for (let country1 of array)
      {
        if (country1['remote'] === true) {
          locationArray.push({name: 'Remote' , visa_needed : country1['visa_needed']});
        }

        if (country1['country']) {
          let country = country1['country'] + ' (country)'
          locationArray.push({name:  country , visa_needed : country1['visa_needed']});
        }
        if (country1['city']) {
          let city = country1['city'].city + ", " + country1['city'].country + " (city)";
          locationArray.push({_id:country1['city']._id ,name: city , visa_needed : country1['visa_needed']});
        }
      }

      locationArray.sort();
      if(locationArray.find((obj => obj.name === 'Remote'))) {
        let remoteValue = locationArray.find((obj => obj.name === 'Remote'));
        locationArray.splice(0, 0, remoteValue);
        locationArray = removeDuplication(locationArray);
      }
      this.selectedLocation = locationArray;
      this.object = this.selectedLocation;
    }

  }

}
