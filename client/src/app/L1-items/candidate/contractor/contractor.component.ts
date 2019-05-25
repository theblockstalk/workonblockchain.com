import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {LocationsComponent} from '../locations/locations.component';
import { RoleComponent} from '../role/role.component';
import { checkNumber } from '../../../../services/object';
import { constants } from '../../../../constants/constants';

@Component({
  selector: 'app-i-forme-contractor',
  templateUrl: './contractor.component.html',
  styleUrls: ['./contractor.component.css']
})
export class ContractorComponent implements OnInit {
  @Input() contractor: any = {};
  currencies = constants.currencies;
  contractor_types = constants.contractorTypes;
  @ViewChild(LocationsComponent) locationComp: LocationsComponent;
  @ViewChild(RoleComponent) role: RoleComponent;
  location;
  roles;
  hourly_rate;
  currency;
  max_hour_per_week;
  max_hours = [];
  descErrMsg;
  currencyErrMsg;
  hourlyErrMsg;
  typeErrMsg;

  constructor() {
    if(this.contractor) {
      this.location = this.contractor['location'];
      this.roles = this.contractor['roles'];
      this.hourly_rate = this.contractor['hourly_rate'];
      this.currency = this.contractor['currency'];
      this.max_hour_per_week = this.contractor['max_hour_per_week'];
    }
  }

  ngOnInit() {
    for(let i =5; i<=60; i=i+5) {
      this.max_hours.push(i);
    }
  }

  selfValidate() {
    if(!this.locationComp.selfValidate()) return false;
    if(!this.role.selfValidate()) return false;
    if(!this.descValidation()) return false;
    if(!this.hourlyValidate()) return false;
    if(!this.currencyValidate()) return false;
    if(!this.descValidation()) return false;

    return true;

  }

  descValidation() {
    if(!this.contractor['service_description']) {
      this.descErrMsg = 'Please enter service description';
      return false;
    }
    delete this.descErrMsg;
    return true;
  }

  currencyValidate() {
    if(!this.contractor['currency']) {
      this.currencyErrMsg = 'Please select currency';
      return false;
    }
    delete this.currencyErrMsg;
    return true;
  }

  hourlyValidate() {
    if(!this.contractor['expected_hourly_rate']) {
      this.hourlyErrMsg = 'Please enter hourly rate';
      return false;
    }
    if(this.contractor['expected_hourly_rate']) {
      if(!checkNumber(this.contractor['expected_hourly_rate'])) {
        this.hourlyErrMsg = 'Please enter only digits';
        return false;
      }
    }
    delete this.hourlyErrMsg;
    return true;
  }

  typeValidate() {
    if(!this.contractor['contractor_type']) {
      this.typeErrMsg = 'Please select atleast one contractor type';
      return false;
    }
    if(this.contractor['contractor_type'] && this.contractor['contractor_type'].length === 0) {
      this.typeErrMsg = 'Please select atleast one contractor type';
      return false;
    }
    delete this.typeErrMsg;
    return true;
  }
}
