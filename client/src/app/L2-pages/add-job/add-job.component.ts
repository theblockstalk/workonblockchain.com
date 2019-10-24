import { Component, OnInit, Input, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import {isPlatformBrowser} from "@angular/common";
import { Router } from '@angular/router';
import {UserService} from '../../user.service';
import {SkillsAutoSuggestComponent} from '../../L1-items/users/skills-auto-suggest/skills-auto-suggest.component';

import {constants} from '../../../constants/constants';
import { checkNumber, unCheckCheckboxes } from '../../../services/object';
declare var $:any;

@Component({
  selector: 'app-p-add-job',
  templateUrl: './add-job.component.html',
  styleUrls: ['./add-job.component.css']
})
export class AddJobComponent implements OnInit {
  @ViewChild(SkillsAutoSuggestComponent) skillsAutoSuggestComp: SkillsAutoSuggestComponent;
  @Input() userDoc: object;
  @Input() viewBy: string; // "admin", "company"

  email_notificaiton = constants.email_notificaiton;
  when_receive_email_notitfications;job_name;job_status;
  job_status_options = constants.job_status;jobStatusErrMsg;
  jobNameErrMsg;error_msg;workTypes = constants.workTypes;
  work_type;work_type_log;employeeCheck = false;selected_work_type=[];
  contractorCheck = false;volunteerCheck = false;
  employee: any = {}; contractor: any = {}; volunteer: any = {};
  employment_type_log;position_type = constants.job_type;min_salary_log;
  annual_salary_currency_log;currency = constants.currencies;
  num_people_desired;num_people_desired_log;resources = constants.resources;
  min_hourly_log;hourly_currency_log;employment_type;min_annual_salary;
  max_annual_salary;annual_currency;hourly_rate_currency;max_hourly_rate;
  min_hourly_rate;cities;selectedLocation = [];selectedValueArray = [];error;
  location_log;country;roles_log;roles;jobselected = [];user_roles = [];
  commercialSkillsFromDB;selectedCommercialSkillsNew;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private router: Router,private authenticationService: UserService) { }

  ngOnInit() {
    console.log('add job page');
    this.roles = unCheckCheckboxes(constants.workRoles);
    this.when_receive_email_notitfications = this.userDoc['when_receive_email_notitfications'];
  }

  addJob(){
    let errorCount = 0;
    this.error_msg = "";
    if(!this.job_name){
      errorCount = 1;
      this.jobNameErrMsg = "Please enter job name";
    }
    if(!this.job_status){
      errorCount = 1;
      this.jobStatusErrMsg = "Please select job status";
    }
    if(this.employeeCheck === false && this.contractorCheck === false && this.volunteerCheck === false) {
      this.work_type_log = "Please select work type";
      errorCount = 1;
    }
    if(this.employeeCheck) {
      if(!this.employment_type) {
        this.employment_type_log = "Please choose position type";
        errorCount = 1;
      }
      if(!this.min_annual_salary) {
        this.min_salary_log = "Please enter minimum annual salary";
        errorCount = 1;
      }
      if(this.max_annual_salary && !checkNumber(this.max_annual_salary))
        errorCount = 1;

      if(!this.annual_currency || this.annual_currency === 'Currency') {
        this.annual_salary_currency_log = "Please choose currency";
        errorCount = 1;
      }
    }
    if(this.contractorCheck) {
      if(!this.min_hourly_rate) {
        this.min_hourly_log = "Please enter minimum hourly rate";
        errorCount = 1;
      }
      if(this.max_hourly_rate && !checkNumber(this.max_hourly_rate))
        errorCount = 1;

      if(!this.hourly_rate_currency || this.hourly_rate_currency === 'Currency') {
        this.hourly_currency_log = "Please choose currency";
        errorCount = 1;
      }
    }
    if (!this.num_people_desired) {
      this.num_people_desired_log = "Please choose a number";
      errorCount = 1;
    }
    if(!this.selectedLocation || this.selectedLocation.length <= 0){
      this.location_log = "Please enter atleast one location";
      errorCount = 1;
    }
    if(!this.user_roles || this.user_roles.length <= 0){
      this.roles_log = "Please select atleast one role";
      errorCount = 1;
    }
    if(!this.skillsAutoSuggestComp.selfValidate()) errorCount = 1;

    if(errorCount === 0) {
      console.log('this.min_hourly_rate: ' + this.min_hourly_rate);
      console.log(this.selectedLocation);
      console.log(this.employment_type);
      console.log(this.job_status);
      console.log(this.user_roles);
      console.log(this.selectedCommercialSkillsNew);
      console.log('add job ftn');
    }
    else this.error_msg = "One or more fields need to be completed. Please scroll up to see which ones.";
  }

  workTypeChange(event) {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh');
      }, 300);
    }
    if(event.target.checked) this.selected_work_type.push(event.target.value);
    else {
      let updateItem = this.selected_work_type.find(x => x === event.target.value);
      let index = this.selected_work_type.indexOf(updateItem);
      this.selected_work_type.splice(index, 1);
    }

    if(this.selected_work_type.indexOf('employee') > -1) this.employeeCheck = true;
    else this.employeeCheck = false;
    if(this.selected_work_type.indexOf('contractor') > -1) this.contractorCheck = true;
    else this.contractorCheck = false;
    if(this.selected_work_type.indexOf('volunteer') > -1) this.volunteerCheck = true;
    else this.volunteerCheck = false;
  }

  suggestedOptions(inputParam) {
    if(inputParam !== '') {
      this.error='';
      this.authenticationService.autoSuggestOptions(inputParam , true)
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
                if(cities['country'] ) {
                  let countryString = cities['country']  + " (country)";
                  if(citiesOptions.findIndex((obj => obj.name === countryString)) === -1)
                    citiesOptions.push({_id:Math.floor((Math.random() * 100000) + 1), name: countryString});
                }
              }
              this.cities = citiesOptions;
            }
          },
          error=>
          {
            if(error['message'] === 500 || error['message'] === 401) {
              localStorage.setItem('jwt_not_found', 'Jwt token not found');
              localStorage.removeItem('currentUser');
              localStorage.removeItem('googleUser');
              localStorage.removeItem('close_notify');
              localStorage.removeItem('linkedinUser');
              localStorage.removeItem('admin_log');
              window.location.href = '/login';
            }

            if(error.message === 403) this.router.navigate(['/not_found']);

          });
    }
    return this.cities;
  }

  employeeSelectedValueFunction(e) {
    if(this.cities) {
      const citiesExist = this.cities.find(x => x.name === e);
      if(citiesExist) {
        this.country = '';
        this.cities = [];
        if(this.selectedValueArray.find(x => x.name === e)) {
          this.error = 'This location has already been selected';
          setInterval(() => {
            this.error = "" ;
          }, 4000);
        }
        else {
          if(citiesExist) this.selectedValueArray.push({_id:citiesExist._id ,  name: e, visa_needed:false});
          else this.selectedValueArray.push({ name: e, visa_needed:false});
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
          this.selectedValueArray = this.selectedValueArray;
        }
        this.selectedLocation = this.selectedValueArray;
      }
    }
  }

  employeeUpdateCitiesOptions(event) {
    this.updateCitiesOptions(event.target.value ,event.target.checked, this.selectedLocation );
  }

  updateCitiesOptions(input, check,array) {
    let objIndex = array.findIndex((obj => obj.name === input));
    array[objIndex].visa_needed = check;
    return array;
  }

  employeeDeleteLocationRow(index){
    this.deleteLocationRow(this.selectedLocation, index);
  }

  deleteLocationRow(array, index){
    array.splice(index, 1);
  }

  index;
  positionSelectedOptions(position) {
    this.index = this.jobselected.indexOf(position);
    if(this.index > -1) {
      return 'selected';
    }
    else return;
  }

}
