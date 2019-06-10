import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { constants } from '../../../../constants/constants';
import {LocationsComponent} from '../locations/locations.component';
import { RoleComponent} from '../role/role.component';
import { checkNumber } from '../../../../services/object';
import { Employee } from '../../../../constants/interface';

@Component({
  selector: 'app-i-forme-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  @Input() employee: Employee;
  @Input() errorMsg: string;
  @ViewChild(LocationsComponent) locationComp: LocationsComponent;
  @ViewChild(RoleComponent) role: RoleComponent;

  positionTypes = constants.job_type;
  employement_availability = constants.workAvailability;
  currencies = constants.currencies;
  typeErrMsg;
  salaryErrMsg;
  currencyErrMsg;
  availErrMsg;
  constructor() { }

  ngOnInit() {
    console.log(this.employee);
  }

  typeValidate() {
    if(!this.employee['employment_type']) {
      this.typeErrMsg = "Please select atleast one type";
      return false;
    }
    if(this.employee['employment_type'] && this.employee['employment_type'].length <=0 ) {
      this.typeErrMsg = "Please select atleast one type";
      return false;
    }
    delete this.typeErrMsg;
    return true;
  }

  salaryValidate() {
    if(!this.employee['expected_annual_salary']) {
      this.salaryErrMsg = 'Please enter expected salary';
      return false;
    }
    if(this.employee['expected_annual_salary']) {
      if(!checkNumber(this.employee['expected_annual_salary'])) {
        this.salaryErrMsg = 'Please enter only digits';
        return false;
      }
      this.employee['expected_annual_salary'] = Number(this.employee['expected_annual_salary']);
    }
    delete this.salaryErrMsg;
    return true;
  }

  currencyValidate() {
    if(!this.employee['currency']) {
      this.currencyErrMsg = 'Please select currency';
      return false;
    }
    if(this.employee['currency'] === 'Currency') {
      this.currencyErrMsg = 'Please select currency';
      return false;
    }
    delete this.currencyErrMsg;
    return true;
  }

  availabilityValidate() {
    console.log(this.employee['employment_availability']);
    if(!this.employee['employment_availability']) {
      this.availErrMsg = 'Please select employment availability';
      return false;
    }
    delete this.availErrMsg;
    return true;
  }

  selfValidate() {
    const locValid = this.locationComp.selfValidate()
    const roleValid = this.role.selfValidate();
    const typeValid = this.typeValidate();
    const salaryValid = this.salaryValidate();
    const currencyValid = this.currencyValidate();
    const availValid = this.availabilityValidate();

    if(locValid && roleValid && typeValid && salaryValid && currencyValid && availValid) {
      return true;
    }
    else return false;
  }

}
