import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {LocationsComponent} from '../locations/locations.component';
import { RoleComponent} from '../role/role.component';
import { checkNumber } from '../../../../services/object';
import { constants } from '../../../../constants/constants';
import { regexs } from '../../../../constants/regex';
import { Contractor } from '../../../../constants/interface';

@Component({
  selector: 'app-i-forme-contractor',
  templateUrl: './contractor.component.html',
  styleUrls: ['./contractor.component.css']
})
export class ContractorComponent implements OnInit {
  @Input() contractor: Contractor;
  @Input() errorMsg: string;
  @ViewChild(LocationsComponent) locationComp: LocationsComponent;
  @ViewChild(RoleComponent) role: RoleComponent;
  currencies = constants.currencies;
  contractor_types = constants.contractorTypes;
  max_hours = [];
  descErrMsg;
  currencyErrMsg;
  hourlyErrMsg;
  typeErrMsg;
  agencyCheck;
  agencyErrMsg;

  constructor() {
  }

  ngOnInit() {
    this.max_hours[0] = -1;
    for(let i =5; i<=60; i=i+5) {
      this.max_hours.push(i);
    }
  }

  selfValidate() {
    const locValid = this.locationComp.selfValidate()
    const roleValid = this.role.selfValidate();
    const descValid = this.descValidation();
    const hourlyValid = this.hourlyValidate();
    const currencyValid = this.currencyValidate();
    const typeValid = this.typeValidate();
    const webValid = this.websiteValidate();
    if(locValid && roleValid && descValid && hourlyValid && currencyValid && typeValid && webValid) {
      if(this.contractor['max_hour_per_week'] === Number('-1')) {
        delete this.contractor['max_hour_per_week'];
      }
      else this.contractor['max_hour_per_week'] = Number(this.contractor['max_hour_per_week']);
      this.contractor['expected_hourly_rate'] = Number(this.contractor['expected_hourly_rate']);
      return true;
    }
    else return false;
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
    if(this.contractor['currency'] === 'Currency') {
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
    if(this.contractor['contractor_type']){
      if(this.contractor['contractor_type'].length === 0) {
        this.typeErrMsg = 'Please select atleast one contractor type';
        return false;
      }
      else {
        if(this.contractor['contractor_type'].find(x => x === 'agency')) {
          this.agencyCheck = true;
        }
        else this.agencyCheck = false;
      }
    }
    delete this.typeErrMsg;
    return true;
  }

  websiteValidate() {
    if(this.agencyCheck) {
      if(!this.contractor['agency_website']) {
        this.agencyErrMsg = 'Please enter agency website';
        return false;
      }
      if(this.contractor['agency_website']) {
        const regex = new RegExp(regexs.url_regex);
        if (!regex.test(this.contractor['agency_website'])) {
          this.agencyErrMsg = 'Enter url in proper format';
          return false;
        }
        delete this.agencyErrMsg;
        return true;
      }
    }
    delete this.agencyErrMsg;
    return true;
  }
}
