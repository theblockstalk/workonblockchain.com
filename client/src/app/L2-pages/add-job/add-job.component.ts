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

  @Input() userDoc: object; //for adding new job
  @Input() jobDoc: object; //for updating current job
  @Input() viewBy: string; // "admin", "company"
  @Input() method: string; // "add", "update"

  job_name;job_status;job_status_options = constants.job_status;jobStatusErrMsg;
  jobNameErrMsg;error_msg;workTypes = constants.workTypes;
  work_type_log;employeeCheck = false;selected_work_type;
  contractorCheck = false;volunteerCheck = false;
  employee: any = {}; contractor: any = {}; volunteer: any = {};
  employment_type_log;position_type = constants.job_type;min_salary_log;
  annual_salary_currency_log;currency = constants.currencies;
  num_people_desired;num_people_desired_log;resources = constants.resources;
  min_hourly_log;hourly_currency_log;employment_type;min_annual_salary;
  max_annual_salary;annual_currency;hourly_rate_currency;max_hourly_rate;
  min_hourly_rate;cities;selectedValueArray = [];error;
  location_log;country;roles_log;roles;jobselected = [];user_roles = [];
  commercialSkillsFromDB;selectedCommercialSkillsNew;optionalSkillsFromDB;
  selectedOptionalSkillsNew;description_content;validatedLocation = [];
  visa_needed = false;jobsAdded = 0;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private router: Router,private authenticationService: UserService) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh');
      }, 300);
    }

    console.log('add job page');
    console.log(this.method);
    this.roles = unCheckCheckboxes(constants.workRoles);

    if(this.method === 'add') {
      if (this.userDoc['job_ids'] && this.userDoc['job_ids'].length > 0)
        this.jobsAdded = 1;
    }
    if(this.method === 'update') {
      console.log(this.jobDoc);
      this.selected_work_type = this.jobDoc['work_type'];
      if(this.selected_work_type === 'employee') {
        this.employeeCheck = true;
        this.employment_type = this.jobDoc['job_type'];
        this.min_annual_salary = this.jobDoc['expected_salary_min'];
        if(this.jobDoc['expected_salary_max'])
          this.max_annual_salary = this.jobDoc['expected_salary_max'];

        this.annual_currency = this.jobDoc['currency'];
      }
      if(this.selected_work_type === 'contractor') {
        this.contractorCheck = true;
        this.min_hourly_rate = this.jobDoc['expected_hourly_rate_min'];
        this.max_hourly_rate = this.jobDoc['expected_hourly_rate_max'];
        this.hourly_rate_currency = this.jobDoc['currency'];
      }
      if(this.selected_work_type === 'volunteer') this.volunteerCheck = true;

      this.user_roles = this.jobDoc['positions'];
      if(this.jobDoc['locations'] && this.jobDoc['locations'].length > 0)
        this.selectedCompanyLocation(this.jobDoc['locations']);

      this.job_name = this.jobDoc['name'];
      this.job_status = this.jobDoc['status'];
      this.num_people_desired = this.jobDoc['num_people_desired'].toString();
      this.commercialSkillsFromDB = this.jobDoc['required_skills'];
      if(this.jobDoc['not_required_skills'] && this.jobDoc['not_required_skills'].length > 0)
        this.optionalSkillsFromDB = this.jobDoc['not_required_skills'];

      this.description_content = this.jobDoc['description'];
    }
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

      if(this.max_annual_salary && Number(this.max_annual_salary) < Number(this.min_annual_salary))
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

      if(this.max_hourly_rate && Number(this.max_hourly_rate) < Number(this.min_hourly_rate))
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
    if(!this.selectedValueArray || this.selectedValueArray.length <= 0){
      this.location_log = "Please enter atleast one location";
      errorCount = 1;
    }
    if(!this.user_roles || this.user_roles.length <= 0){
      this.roles_log = "Please select atleast one role";
      errorCount = 1;
    }
    if(!this.skillsAutoSuggestComp.selfValidate()) errorCount = 1;
    if(!this.pageContent.selfValidate()) errorCount = 1;

    if(errorCount === 0) {
      let inputQuery : any ={};
      inputQuery.name = this.job_name;
      if(this.job_status) {
        const filtered = this.job_status_options.filter( (item) => item.name === this.job_status)
        if(filtered && filtered.length > 0)
          inputQuery.status = filtered[0].value;
        else inputQuery.status = this.job_status;
      }
      if(this.selected_work_type) inputQuery.work_type = this.selected_work_type;

      this.validatedLocation = [];
      for(let location of this.selectedValueArray) {
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

      inputQuery.locations = this.validatedLocation;
      if(this.visa_needed)inputQuery.visa_needed = this.visa_needed;
      if(this.employeeCheck) {
        if(this.employment_type)inputQuery.job_type = this.employment_type;
        if(this.min_annual_salary)inputQuery.expected_salary_min = parseInt(this.min_annual_salary);
        if(this.max_annual_salary)inputQuery.expected_salary_max = parseInt(this.max_annual_salary);
        else {
          if(this.method === 'update') inputQuery.unset_expected_salary_max = true;
        }
      }
      else {
        if(this.method === 'update') {
          inputQuery.unset_job_type = true;
          inputQuery.unset_expected_salary_min = true;
          inputQuery.unset_expected_salary_max = true;
        }
      }
      if(this.contractorCheck) {
        if(this.min_hourly_rate)inputQuery.expected_hourly_rate_min = parseInt(this.min_hourly_rate);
        if(this.max_hourly_rate)inputQuery.expected_hourly_rate_max = parseInt(this.max_hourly_rate);
        else {
          if (this.method === 'update') inputQuery.unset_expected_hourly_rate_max = true;
        }
      }
      else {
        if (this.method === 'update') {
          inputQuery.unset_expected_hourly_rate_min = true;
          inputQuery.unset_expected_hourly_rate_max = true;
        }
      }
      if(this.user_roles)inputQuery.positions = this.user_roles;
      if(this.annual_currency)inputQuery.currency = this.annual_currency;
      if(this.hourly_rate_currency)inputQuery.currency = this.hourly_rate_currency;
      if(this.num_people_desired)inputQuery.num_people_desired = parseInt(this.num_people_desired);

      if(this.selectedCommercialSkillsNew && this.selectedCommercialSkillsNew.length > 0) {
        inputQuery.required_skills = skillsMapping(this.selectedCommercialSkillsNew);
      }
      if(this.selectedOptionalSkillsNew && this.selectedOptionalSkillsNew.length > 0)
        inputQuery.not_required_skills = skillsMapping(this.selectedOptionalSkillsNew);

      if(this.pageContent.content)inputQuery.description = this.pageContent.content;
      console.log(inputQuery);
      console.log('add job ftn call BE');
      let admin = false;
      if(this.viewBy === 'admin') admin = true;
      if(this.method === 'add') {
        this.authenticationService.postJob(inputQuery, this.userDoc['_id'], admin)
          .subscribe(
            data => {
              if (data) {
                if(admin)
                  this.router.navigate(['/admins/company/'+data['company_id']+'/jobs/'+data['_id']]);
                else {
                  if (this.jobsAdded === 0) this.router.navigate(['/users/company/wizard/pricing']);
                  else this.router.navigate(['/users/company']);
                }
              }
            },
            error => {
              if (error['message'] === 500 || error['message'] === 401) {
                localStorage.setItem('jwt_not_found', 'Jwt token not found');
                localStorage.removeItem('currentUser');
                localStorage.removeItem('googleUser');
                localStorage.removeItem('close_notify');
                localStorage.removeItem('linkedinUser');
                localStorage.removeItem('admin_log');
                window.location.href = '/login';
              }
              if (error.message === 403) this.router.navigate(['/not_found']);
            }
          );
      }
      if(this.method === 'update') {
        console.log('update baby');
        this.authenticationService.updateJob(inputQuery, this.jobDoc['company_id'], this.jobDoc['_id'], admin)
          .subscribe(
            data => {
              if (data) {
                if(admin)
                  this.router.navigate(['/admins/company/'+this.jobDoc['company_id']+'/jobs/'+this.jobDoc['_id']]);
                else this.router.navigate(['/users/company/jobs/'+this.jobDoc['_id']]);
              }
            },
            error => {
              if (error['message'] === 500 || error['message'] === 401) {
                localStorage.setItem('jwt_not_found', 'Jwt token not found');
                localStorage.removeItem('currentUser');
                localStorage.removeItem('googleUser');
                localStorage.removeItem('close_notify');
                localStorage.removeItem('linkedinUser');
                localStorage.removeItem('admin_log');
                window.location.href = '/login';
              }
              if (error.message === 403) this.router.navigate(['/not_found']);
            }
          );
      }
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
      this.authenticationService.autoSuggestOptions(inputParam , false)
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
      }
    }
  }

  employeeUpdateCitiesOptions(event) {
    this.updateCitiesOptions(event.target.value ,event.target.checked, this.selectedValueArray );
  }

  updateCitiesOptions(input, check,array) {
    let objIndex = array.findIndex((obj => obj.name === input));
    array[objIndex].visa_needed = check;
    return array;
  }

  employeeDeleteLocationRow(index){
    this.deleteLocationRow(this.selectedValueArray, index);
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
          let city = country1['city'];
          this.selectedValuesDB.push({_id:country1['_id'] ,city_id:country1['city_id'] ,name: city });
        }
        if (country1['country']) {
          let country = country1['country'] + ' (country)';
          this.selectedValuesDB.push({_id: country1['_id'], name:  country});
        }
      }

      this.selectedValuesDB.sort();
      if(this.selectedValuesDB.find((obj => obj.name === 'Remote'))) {
        let remoteValue = this.selectedValuesDB.find((obj => obj.name === 'Remote'));
        this.selectedValuesDB.splice(0, 0, remoteValue);
        this.selectedValuesDB = this.filter_array(this.selectedValuesDB);
      }
      this.selectedValueArray = this.selectedValuesDB;
      return '';
    }
    else {
      this.selectedValueArray.push([]);
      return '';
    }
  }

  convertNumber(string) {
    return Number(string);
  }

}
