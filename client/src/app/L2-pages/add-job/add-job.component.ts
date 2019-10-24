import { Component, OnInit, Input, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import {isPlatformBrowser} from "@angular/common";
import { Router } from '@angular/router';
import {UserService} from '../../user.service';
import {SkillsAutoSuggestComponent} from '../../L1-items/users/skills-auto-suggest/skills-auto-suggest.component';
import { ContentComponent } from '../../L1-items/pages/content/content.component';

import {constants} from '../../../constants/constants';
import { checkNumber, unCheckCheckboxes, skillsMapping, getNameFromValue } from '../../../services/object';
declare var $:any;

@Component({
  selector: 'app-p-add-job',
  templateUrl: './add-job.component.html',
  styleUrls: ['./add-job.component.css']
})
export class AddJobComponent implements OnInit {
  @ViewChild(SkillsAutoSuggestComponent) skillsAutoSuggestComp: SkillsAutoSuggestComponent;
  @ViewChild(ContentComponent) pageContent: ContentComponent;

  @Input() userDoc: object;
  @Input() viewBy: string; // "admin", "company"

  email_notificaiton = constants.email_notificaiton;
  when_receive_email_notitfications;job_name;job_status;
  job_status_options = constants.job_status;jobStatusErrMsg;
  jobNameErrMsg;error_msg;workTypes = constants.workTypes;
  work_type;work_type_log;employeeCheck = false;selected_work_type;
  contractorCheck = false;volunteerCheck = false;
  employee: any = {}; contractor: any = {}; volunteer: any = {};
  employment_type_log;position_type = constants.job_type;min_salary_log;
  annual_salary_currency_log;currency = constants.currencies;
  num_people_desired;num_people_desired_log;resources = constants.resources;
  min_hourly_log;hourly_currency_log;employment_type;min_annual_salary;
  max_annual_salary;annual_currency;hourly_rate_currency;max_hourly_rate;
  min_hourly_rate;cities;selectedLocation = [];selectedValueArray = [];error;
  location_log;country;roles_log;roles;jobselected = [];user_roles = [];
  commercialSkillsFromDB;selectedCommercialSkillsNew;optionalSkillsFromDB;
  selectedOptionalSkillsNew;description_content;validatedLocation = [];
  visa_needed = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private router: Router,private authenticationService: UserService) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh');
      }, 300);
    }

    console.log('add job page');
    console.log(this.userDoc);
    //this.selectedCompanyLocation(employee.location);
    this.roles = unCheckCheckboxes(constants.workRoles);
    this.when_receive_email_notitfications = this.userDoc['when_receive_email_notitfications'];
  }

  addJob(){
    console.log(this.visa_needed);
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

      if(Number(this.max_annual_salary) < Number(this.min_annual_salary))
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

      if(Number(this.max_hourly_rate) < Number(this.min_hourly_rate))
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
    if(this.pageContent.selfValidate()) console.log(this.pageContent.content);
    else errorCount = 1;

    if(errorCount === 0) {
      let inputQuery : any ={};
      inputQuery.name = this.job_name;
      if(this.job_status) {
        const filtered = this.job_status_options.filter( (item) => item.name === this.job_status)
        inputQuery.status = filtered[0].value;
      }
      if(this.selected_work_type) inputQuery.work_type = this.selected_work_type;

      this.validatedLocation = [];
      for(let location of this.selectedLocation) {
        if(location.name.includes('city')) {
          this.validatedLocation.push({city_id: location._id, city: location.name});
        }
        if(location.name.includes('country')) {
          this.validatedLocation.push({country: location.name.split(" (")[0]});
        }
        if(location.name === 'Remote') {
          this.validatedLocation.push({remote: true});
        }
      }
      console.log(this.validatedLocation);
      inputQuery.locations = this.validatedLocation;
      if(this.visa_needed)inputQuery.visa_needed = this.visa_needed;
      if(this.employeeCheck) {
        if(this.employment_type)inputQuery.job_type = this.employment_type;
        if(this.min_annual_salary)inputQuery.expected_salary_min = parseInt(this.min_annual_salary);
        if(this.max_annual_salary)inputQuery.expected_salary_max = parseInt(this.max_annual_salary);
      }
      if(this.contractorCheck) {
        if(this.min_hourly_rate)inputQuery.expected_hourly_rate_min = parseInt(this.min_hourly_rate);
        if(this.max_hourly_rate)inputQuery.expected_hourly_rate_max = parseInt(this.max_hourly_rate);
      }
      if(this.user_roles)inputQuery.positions = this.user_roles;
      if(this.annual_currency)inputQuery.currency = this.annual_currency;
      if(this.hourly_rate_currency)inputQuery.currency = this.hourly_rate_currency;
      if(this.num_people_desired)inputQuery.num_people_desired = parseInt(this.num_people_desired);

      console.log(this.selectedCommercialSkillsNew);
      if(this.selectedCommercialSkillsNew && this.selectedCommercialSkillsNew.length > 0) {
        inputQuery.required_skills = skillsMapping(this.selectedCommercialSkillsNew);
      }
      if(this.selectedOptionalSkillsNew && this.selectedOptionalSkillsNew.length > 0) {
        console.log(this.selectedOptionalSkillsNew);
        inputQuery.not_required_skills = skillsMapping(this.selectedOptionalSkillsNew);
      }
      if(this.pageContent.content)inputQuery.description = this.pageContent.content;
      console.log(inputQuery);
      console.log('add job ftn');
      let admin = false;
      if(this.viewBy === 'admin') admin = true;
      this.authenticationService.postJob(inputQuery , this.userDoc['_id'], admin)
      .subscribe(
        data => {
          if(data) {
              console.log(data);
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
        }
      );
    }
    else this.error_msg = "One or more fields need to be completed. Please scroll up to see which ones.";
  }

  workTypeChange(event) {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh');
      }, 300);
    }

    this.selected_work_type = '';
    if(event.target.value === 'employee' && event.target.checked) {
      this.employeeCheck = true;
      this.selected_work_type = 'employee';
    }
    else this.employeeCheck = false;

    if(event.target.value === 'contractor' && event.target.checked) {
      this.contractorCheck = true;
      this.selected_work_type = 'contractor';
    }
    else this.contractorCheck = false;

    if(event.target.value === 'volunteer' && event.target.checked) {
      this.volunteerCheck = true;
      this.selected_work_type = 'volunteer';
    }
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
          this.selectedValueArray = this.filter_array(this.selectedValueArray);
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

  filter_array(arr) {
    var hashTable = {};
    return arr.filter(function (el) {
      var key = JSON.stringify(el);
      var match = Boolean(hashTable[key]);

      return (match ? false : hashTable[key] = true);
    });
  }

  selectedValuesDB = [];
  selectedCompanyLocation(location) {
    this.selectedValuesDB=[];
    if(location && location.length > 0) {
      for (let country1 of location)
      {
        if (country1['remote'] === true) {
          this.selectedValuesDB.push({_id:country1['_id'] ,name: 'Remote' });
        }

        if (country1['city']) {
          let city = country1['city'].city + ", " + country1['city'].country;
          this.selectedValuesDB.push({_id:country1['_id'] ,city:country1['city']._id ,name: city });
        }
      }

      this.selectedValuesDB.sort();
      if(this.selectedValuesDB.find((obj => obj.name === 'Remote'))) {
        let remoteValue = this.selectedValuesDB.find((obj => obj.name === 'Remote'));
        this.selectedValuesDB.splice(0, 0, remoteValue);
        this.selectedValuesDB = this.filter_array(this.selectedValuesDB);
      }
      this.selectedLocation.push(this.selectedValuesDB);
      return '';
    }
    else {
      this.selectedLocation.push([]);
      return '';
    }
  }

  convertNumber(string) {
    return Number(string);
  }

}
