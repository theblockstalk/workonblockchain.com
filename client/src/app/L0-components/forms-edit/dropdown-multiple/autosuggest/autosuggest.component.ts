import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {UserService} from '../../../../user.service';
import {filter_array} from '../../../../../services/object'
import { Router } from '@angular/router';

@Component({
  selector: 'L0-autosuggest',
  templateUrl: './autosuggest.component.html',
  styleUrls: ['./autosuggest.component.css']
})
export class AutosuggestComponent implements OnInit {
  @Input() placeholder;
  @Input() userType;
  @Output() selectedLocations : EventEmitter<any> = new EventEmitter<any>();
  countries;
  selectedValueArray = [];
  error;
  countriesModel;
  cities = [];

  constructor(private authenticationService: UserService, private router: Router) { }

  ngOnInit() {
  }

  suggestedOptions() {
    if(this.countriesModel !== '') {
      this.error='';
      this.authenticationService.autoSuggestOptions(this.countriesModel , true)
        .subscribe(
          data => {
            if(data) {
              let citiesInput = data;
              let citiesOptions=[];
              for(let cities of citiesInput['locations']) {
                if(cities['remote'] === true) {
                  citiesOptions.push({_id:Math.floor((Math.random() * 100000) + 1), name: 'Remote'});
                }
                if(cities['city']) {
                  let cityString = cities['city'].city + ", " + cities['city'].country + " (city)";
                  citiesOptions.push({_id : cities['city']._id , name : cityString});
                }
                if(this.userType === 'candidate' && cities['country'] ) {
                  let countryString = cities['country']  + " (country)";
                  if(citiesOptions.findIndex((obj => obj.name === countryString)) === -1)
                    citiesOptions.push({_id:Math.floor((Math.random() * 100000) + 1), name: countryString});
                }
              }
              this.cities = filter_array(citiesOptions);
            }

          },
          error=>
          {
            if(error['message'] === 500 || error['message'] === 401)
            {
              localStorage.setItem('jwt_not_found', 'Jwt token not found');
              localStorage.removeItem('currentUser');
              localStorage.removeItem('googleUser');
              localStorage.removeItem('close_notify');
              localStorage.removeItem('linkedinUser');
              localStorage.removeItem('admin_log');
              window.location.href = '/login';
            }
            if(error.message === 403)
            {
              this.router.navigate(['/not_found']);
            }

          });
    }
  }

  selectedValueFunction(inputValue) {
    if(this.cities) {
      const citiesExist = this.cities.find(x => x.name === inputValue);
      if(citiesExist) {
        this.countriesModel = '';
        this.cities = [];
        if(this.userType === 'candidate' && this.selectedValueArray.length > 9) {
          this.error = 'You can select maximum 10 locations';
          setInterval(() => {
            this.error = "" ;
          }, 5000);
        }
        else if(this.userType === 'company' && this.selectedValueArray.length > 4) {
          this.error = 'You can select maximum 5 locations';
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
            if(this.userType === 'candidate'){
              if(citiesExist) this.selectedValueArray.push({_id:citiesExist._id ,  name: inputValue, visa_needed:false});
              else this.selectedValueArray.push({ name: inputValue, visa_needed:false});
            }
            else {
              if(citiesExist) this.selectedValueArray.push({_id:citiesExist._id ,  name: inputValue});
              else this.selectedValueArray.push({ name: inputValue});
            }
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
          let remoteValue = this.selectedValueArray.find((obj => obj.name === 'Remote'));
          this.selectedValueArray.splice(0, 0, remoteValue);
          this.selectedValueArray = filter_array(this.selectedValueArray);
        }
        this.selectedLocations.emit(this.selectedValueArray);
      }
    }
  }

}
