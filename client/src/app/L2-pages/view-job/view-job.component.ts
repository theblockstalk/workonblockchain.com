import { Component, OnInit, Input } from '@angular/core';
import {getNameFromValue, createLocationsListStrings, makeImgCode, makeIconCode} from '../../../services/object';
import {constants} from '../../../constants/constants';

@Component({
  selector: 'app-p-view-job',
  templateUrl: './view-job.component.html',
  styleUrls: ['./view-job.component.css']
})
export class ViewJobComponent implements OnInit {
  @Input() jobDoc: object;
  @Input() viewBy: string; // "admin", "company", "candidate"

  salary;selectedValueArray = [];countries = [];
  mappedPositions = [];

  constructor() { }

  ngOnInit() {
    console.log('on page level');
    console.log(this.jobDoc);
    console.log(this.viewBy);
    if(this.jobDoc['expected_salary_min']) {
      this.salary = this.jobDoc['currency'] + ' ' + this.jobDoc['expected_salary_min'] + ' per year';
      if(this.jobDoc['expected_salary_max'])
        this.salary = this.jobDoc['currency'] + ' ' + this.jobDoc['expected_salary_min'] + '-' + this.jobDoc['expected_salary_max'] + ' per year';
    }

    for(let role of this.jobDoc['positions']){
      const filteredArray = getNameFromValue(constants.workRoles,role);
      this.mappedPositions.push(filteredArray.name);
    }
  }

  createBlockchainLogos(commercial){
    let newCommercials = [];
    for(let commercials of commercial){
      let img;
      if(commercials['type'] === 'blockchain')
        img = makeImgCode(commercials) + ' ' + commercials['name']+': ' +commercials.exp_year +' years exp';

      if(commercials['type'] === 'language')
        img = makeIconCode('fas fa-code') + commercials.name+': ' +commercials.exp_year +' years exp';

      if(commercials.type === 'experience')
        img = makeIconCode('fas fa-user-friends') + commercials.name+': ' +commercials.exp_year +' years exp';

      newCommercials.push(img);
    }
    return newCommercials;
  }

  getLocation(location) {
    this.selectedValueArray = [];
    for (let country1 of location) {
      let locObject : any = {};
      if (country1['remote'] === true) {
        this.selectedValueArray.push({name: 'Remote'});
      }
      if (country1['city']) {
        let city = country1['city'];
        locObject.name = city;
        locObject.type = 'city';
        this.selectedValueArray.push(locObject);
      }
      if (country1['country']) {
        let country = country1['country'] + " (country)";
        locObject.name = country;
        locObject.type = 'country';
        this.selectedValueArray.push(locObject);
      }
    }
    this.countries = this.selectedValueArray;
    this.countries.sort(function(a, b){
      if(a.name < b.name) { return -1; }
      if(a.name > b.name) { return 1; }
      return 0;
    });
    if(this.countries.find((obj => obj.name === 'Remote'))) {
      let remoteValue = this.countries.find((obj => obj.name === 'Remote'));
      this.countries.splice(0, 0, remoteValue);
      this.countries = this.filter_array(this.countries);
    }
    let newCountries = [];
    newCountries = createLocationsListStrings(this.countries);
    return newCountries;
  }

  filter_array(arr) {
    var hashTable = {};
    return arr.filter(function (el) {
      var key = JSON.stringify(el);
      var match = Boolean(hashTable[key]);
      return (match ? false : hashTable[key] = true);
    });
  }

}
