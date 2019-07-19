import { Component, OnInit,AfterViewInit,ViewChild } from '@angular/core';
import {NgForm} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
declare var $:any;
import {constants} from '../../../constants/constants';
import {CandJobActivityComponent} from '../../L1-items/candidate/cand-job-activity/cand-job-activity.component';

import { HttpClient } from '@angular/common/http';
import {unCheckCheckboxes} from "../../../services/object";

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit,AfterViewInit {
  @ViewChild(CandJobActivityComponent) candJobActivity: CandJobActivityComponent;

  constructor(private http: HttpClient,private route: ActivatedRoute,private router: Router,private authenticationService: UserService) { }
  info: any = {};
  country ='';
  interest_area='';
  expected_salary='';
  selectedValue = [];
  expYear=[];
  jobselected=[];
  position='';
  experience_year='';
  currentUser: User;exp_class;
  log; salary; available;link;class;
  availability_day;
  active_class;
  job_active_class;
  exp_active_class;resume_active_class;resume_class;
  about_active_class;
  term_active_class;
  term_link;
  resume_disable;
  exp_disable;
  current_currency;
  current_salary;
  error_msg;
  expected_validation;
  selectedValueArray=[];
  error;
  cities;
  country_log;
  currency_log;
  salary_log;
  avail_log;
  current_sal_log;
  current_currency_log;
  count;
  emptyInput;
  validatedLocation=[];
  position_type = constants.job_type;
  employment_type_log;
  employment_location_log;
  employee_roles_log;
  work_type_log;
  selected_work_type=[];
  employeeCheck=false;
  contractorCheck=false;
  volunteerCheck=false;
  employee: any = {};
  contractor: any = {};
  volunteer: any = {};
  contractor_currency_log;
  contractor_roles_log;
  contractor_hourly_log;
  agency_website_log;
  contractor_description_log;
  contractor_type_log;
  contract_location_log;
  volunteer_location_log;
  volunteer_roles_log;
  objective_log;
  max_hours=[];
  validateUrl;
  employement_availability = constants.workAvailability;
  display_error;
  remote_location_log;
  reasons_of_leaving = constants.reasons_of_leaving;
  job_activity_value;// = 'Not now';
  currently_employ;
  reason_selectedValue = [];
  other_reasons;
  counter_offer;
  allData = 0;

  ngAfterViewInit(): void
  {
    window.scrollTo(0, 0);
    setTimeout(() => {
      $('.selectpicker').selectpicker();
    }, 700);
  }
  ngOnInit()
  {
    this.reasons_of_leaving.sort(function(a, b){
      if(a.name < b.name) { return -1; }
      if(a.name > b.name) { return 1; }
      return 0;
    });

    this.resume_disable = "disabled";
    this.exp_disable = "disabled";
    this.roles = unCheckCheckboxes(constants.workRoles);
    this.employee.employee_roles = this.roles;
    this.volunteer.volunteer_roles = this.roles;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    for(let i =5; i<=60; i=i+5) {
      this.max_hours.push(i);
    }

    if(!this.currentUser)
    {
      this.router.navigate(['/signup']);
    }
    if(this.currentUser && this.currentUser.type === 'candidate')
    {

      this.roles.sort(function(a, b){

        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })


      this.class="btn disabled";
      this.exp_class="btn disabled";
      this.authenticationService.getCandidateProfileById(this.currentUser._id, false)
        .subscribe(
          data => {
            if(data['contact_number']  && data['nationality'])
            {
              this.about_active_class = 'fa fa-check-circle text-success';
            }
            if(data['candidate'].terms_id)
            {
              this.term_active_class='fa fa-check-circle text-success';
              this.term_link = '/terms-and-condition';
            }
            if(data['candidate'].why_work && data['candidate'].interest_areas)
            {
              this.exp_disable ='';
              this.resume_active_class='fa fa-check-circle text-success';
              this.exp_class = "/experience";
            }

            if(data['candidate'].description )
            {
              this.exp_class = "/experience";
              this.exp_active_class = 'fa fa-check-circle text-success';
            }
            if(data['candidate'].employee || data['candidate'].contractor || data['candidate'].volunteer) {
              this.active_class = 'fa fa-check-circle text-success';
              this.class = "btn";
              this.job_active_class = 'fa fa-check-circle text-success';
              this.resume_disable ='';
              this.resume_class="/resume";
            }
            //if(data['candidate'].current_salary) this.current_salary = data['candidate'].current_salary;
            //if(data['candidate'].current_currency) this.current_currency = data['candidate'].current_currency;
            if(data['candidate'].employee) {
              this.employeeCheck = true;
              this.selected_work_type.push('employee');
              let employee = data['candidate'].employee;
              this.employee.employment_type = employee.employment_type;
              this.changeLocationDisplayFormat(employee.location, 'employee');
              this.employee.roles = employee.roles;
              this.employee.expected_annual_salary = employee.expected_annual_salary;
              this.employee.currency = employee.currency;
              this.employee.employment_availability = employee.employment_availability;


            }
            if(data['candidate'].contractor) {
              $('.selectpicker').selectpicker('refresh');
              this.contractorCheck = true;
              this.selected_work_type.push('contractor');
              let contractor = data['candidate'].contractor;
              this.changeLocationDisplayFormat(contractor.location, 'contractor');
              this.contractor.roles = contractor.roles;
              this.contractor.hourly_rate = contractor.expected_hourly_rate;
              this.contractor.currency = contractor.currency;
              if(contractor.max_hour_per_week) this.contractor.max_hour_per_week = contractor.max_hour_per_week;
              this.contractor.contractor_type = contractor.contractor_type;
              for(let type of this.contractor_types ) {
                if(contractor.contractor_type.find(x => x === type.value)){
                  type.checked = true;
                }
                else type.checked = false;
              }
              this.contract_type = contractor.contractor_type;
              if(contractor.agency_website) this.contractor.agency_website = contractor.agency_website;
              if(contractor.service_description) this.contractor.service_description = contractor.service_description;

            }
            if(data['candidate'].volunteer) {
              this.volunteerCheck = true;
              this.selected_work_type.push('volunteer');
              let volunteer = data['candidate'].volunteer;
              this.changeLocationDisplayFormat(volunteer.location, 'volunteer');
              this.volunteer.max_hours_per_week = volunteer.max_hours_per_week;
              this.volunteer.learning_objectives = volunteer.learning_objectives;
              this.volunteer.roles = volunteer.roles;
            }

            if(data['candidate'].job_activity_status) {
              if (data['candidate'].job_activity_status.new_work_opportunities) this.job_activity_value = data['candidate'].job_activity_status.new_work_opportunities;
              if (data['candidate'].job_activity_status.currently_employed) this.currently_employ = data['candidate'].job_activity_status.currently_employed;
              if (data['candidate'].job_activity_status.leaving_current_employ_reasons) {
                for (let reason of data['candidate'].job_activity_status.leaving_current_employ_reasons) {
                  for (let option of this.reasons_of_leaving) {
                    if (option.value === reason) {
                      option.checked = true;
                      this.reason_selectedValue.push(reason);
                    }
                  }
                }
              }
              if (data['candidate'].job_activity_status.other_reasons) {
                this.other_reasons = data['candidate'].job_activity_status.other_reasons;
              }
              if (data['candidate'].job_activity_status.counter_offer) this.counter_offer = data['candidate'].job_activity_status.counter_offer;
              this.allData = 1;
            }
            else this.allData = 1;

            setTimeout(() => {
              $('.selectpicker').selectpicker();
            }, 500);

          },
          error => {
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

            if(error['message'] === 403)
            {
              this.router.navigate(['/not_found']);
            }

          });
    }
    else
    {
      this.router.navigate(['/not_found']);
    }


  }

  currency = constants.currencies;
  experience = constants.experienceYears;
  roles = constants.workRoles;
  area_interested = constants.workBlockchainInterests;
  year = constants.year;
  availability = constants.workAvailability;
  contractor_types = constants.contractorTypes;


  changeLocationDisplayFormat(array,value) {
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
        locationArray = this.filter_array(locationArray);

      }
      if(value === 'employee')  {
        this.employee.selectedLocation = locationArray;
        this.selectedValueArray= locationArray;
      }
      if(value === 'contractor')  {
        this.contractor.selectedLocation = locationArray;
        this.contractorArray = locationArray;

      }
      if(value === 'volunteer')  {
        this.volunteer.selectedLocation = locationArray;
        this.volunteerArray = locationArray;
      }

    }

  }

  onJobSelected(e, type) {
    this.jobselected = [];
    if(type === 'employee') {
      if(this.employee.roles) this.jobselected = this.employee.roles;
    }
    if(type === 'contractor') {
      if(this.contractor.roles) this.jobselected = this.contractor.roles;

    }
    if(type === 'volunteer') {
      if(this.volunteer.roles) this.jobselected = this.volunteer.roles;

    }
    if(e.target.checked) {
      this.jobselected.push(e.target.value);
    }
    else {
      let updateItem = this.jobselected.find(x => x === e.target.value);
      let index = this.jobselected.indexOf(updateItem);
      this.jobselected.splice(index, 1);
    }
    if(type === 'employee') {
      this.employee.roles=  this.jobselected;
    }
    if(type === 'contractor') {
      this.contractor.roles=  this.jobselected;
    }
    if(type === 'volunteer') {
      this.volunteer.roles=  this.jobselected;
    }

  }

  findIndexToUpdate(type) {
    return type == this;
  }

  onExperienceChange(event) {
    this.experience_year=event.target.value;
    this.expYear.push(event.target.value);
  }

  checkValidation(value) {
    if(value.filter(i => i.visa_needed === true).length === value.length) return true;
    else return false;
  }

  contract_type= [];
  contractor_type(inputParam) {
    if(inputParam.target.checked) {
      this.contract_type.push(inputParam.target.value);
    }
    else {
      let updateItem = this.contract_type.find(x => x === inputParam.target.value);
      let index = this.contract_type.indexOf(updateItem);
      this.contract_type.splice(index, 1);
    }
    this.contractor.contractor_type = this.contract_type;
    this.checkContractValue(this.contractor.contractor_type);
  }

  checkContractValue(array) {
    if(array && array.indexOf('agency') > -1) return true;
    else return false;
  }

  onSubmit(f: NgForm) {

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.error_msg = "";
    this.count = 0;
    this.display_error = '';
    this.remote_location_log = '';

    let employeeCount = 0;
    let contractorCount = 0;
    let volunteerCount = 0;
    let inputQuery: any = {};
    let remote_error_count = 0;
    let visaRequired = 0;
    let candidateQuery:any ={};
    let job_activity_statuses:any ={};

    if(this.employeeCheck === false && this.contractorCheck === false && this.volunteerCheck === false) {
      this.work_type_log = "Please select at least one work type";
    }
    if(this.employeeCheck) {
      if(!this.employee.employment_type) {
        this.employment_type_log = "Please choose position type";
        employeeCount = 1;
      }

      if(!this.employee.selectedLocation || (this.employee.selectedLocation && this.employee.selectedLocation.length <= 0) ) {
        this.employment_location_log = "Please select at least one location which you can work in without needing a visa";
        employeeCount = 1;
      }
      if(this.employee.selectedLocation && this.employee.selectedLocation.length > 0) {
        if(this.employee.selectedLocation.filter(i => i.visa_needed === true).length === this.employee.selectedLocation.length) {
          this.display_error = 'employment_location_error';
          visaRequired = 1;
        }

        this.validatedLocation = [];
        for(let location of this.employee.selectedLocation) {
          if(location.name.includes('city')) {
            this.validatedLocation.push({city: location._id, visa_needed : location.visa_needed });
          }
          if(location.name.includes('country')) {
            this.validatedLocation.push({country: location.name.split(" (")[0], visa_needed : location.visa_needed });
          }
          if(location.name === 'Remote') {
            this.validatedLocation.push({remote: true, visa_needed : location.visa_needed });
          }
        }
        this.employee.locations = this.validatedLocation;
      }

      if(this.employee.selectedLocation && this.employee.selectedLocation.length > 10) {
        this.employment_location_log = "Please select maximum 10 locations";
        employeeCount = 1;
      }

      if(!this.employee.roles) {
        this.employee_roles_log = "Please select minimum one role";
        employeeCount = 1;
      }

      if(!this.employee.expected_annual_salary) {
        this.salary_log = "Please enter expected yearly salary";
        employeeCount = 1;
      }
      if(!this.employee.currency || this.employee.currency === 'Currency') {
        this.currency_log = "Please choose currency";
        employeeCount = 1;
      }
      if(!this.employee.employment_availability) {
        this.avail_log = "Please select employment availability";
        employeeCount = 1;
      }
    }

    if(this.contractorCheck) {
      visaRequired = 0;
      if(!this.contractor.selectedLocation || (this.contractor.selectedLocation && this.contractor.selectedLocation.length <= 0) ) {
        this.contract_location_log = "Please select at least one location which you can work in without needing a visa";
        contractorCount = 1;
      }
      if(this.contractor.selectedLocation && this.contractor.selectedLocation.length > 0) {
        if(this.contractor.selectedLocation.filter(i => i.visa_needed === true).length === this.contractor.selectedLocation.length) {
          this.display_error = 'contract_location_error';
          visaRequired = 1;
        }

        this.validatedLocation=[];
        for(let location of this.contractor.selectedLocation) {
          if(location.name.includes('city')) {
            this.validatedLocation.push({city: location._id, visa_needed : location.visa_needed });
          }
          if(location.name.includes('country')) {
            this.validatedLocation.push({country: location.name.split(" (")[0], visa_needed : location.visa_needed });
          }
          if(location.name === 'Remote') {
            this.validatedLocation.push({remote: true, visa_needed : location.visa_needed });
          }

        }
        this.contractor.locations = this.validatedLocation;
      }

      if(this.contractor.selectedLocation && this.contractor.selectedLocation.length > 10) {
        this.contract_location_log = "Please select maximum 10 locations";
        contractorCount = 1;
      }

      if(!this.contractor.roles) {
        this.contractor_roles_log = "Please select minimum one role";
        contractorCount = 1;
      }

      if(!this.contractor.hourly_rate) {
        this.contractor_hourly_log = "Please enter hourly rate";
        contractorCount = 1;
      }
      if(!this.contractor.currency || this.contractor.currency === 'Currency' ) {
        this.contractor_currency_log = "Please choose currency";
        contractorCount = 1;
      }
      if(!this.contractor.contractor_type) {
        this.contractor_type_log = "Please select minimum one contractor type";
        contractorCount = 1;
      }
      if(this.checkContractValue(this.contractor.contractor_type) && !this.contractor.agency_website) {
        this.agency_website_log = "Please enter agency website";
        contractorCount = 1;
      }
      if(!this.contractor.service_description) {
        this.contractor_description_log = "Please enter service description";
        contractorCount = 1;
      }
    }

    if(this.volunteerCheck) {
      visaRequired = 0;
      if(!this.volunteer.selectedLocation || (this.volunteer.selectedLocation && this.volunteer.selectedLocation.length <= 0) ) {
        this.volunteer_location_log = "Please select at least one location which you can work in without needing a visa";
        volunteerCount = 1;
      }
      if(this.volunteer.selectedLocation && this.volunteer.selectedLocation.length > 0) {
        if(this.volunteer.selectedLocation.filter(i => i.visa_needed === true).length === this.volunteer.selectedLocation.length) {
          this.display_error = 'volunteer_location_error';
          visaRequired = 1;
        }

        this.validatedLocation=[];
        for(let location of this.volunteer.selectedLocation) {
          if(location.name.includes('city')) {
            this.validatedLocation.push({city: location._id, visa_needed : location.visa_needed });
          }
          if(location.name.includes('country')) {
            this.validatedLocation.push({country: location.name.split(" (")[0], visa_needed : location.visa_needed });
          }
          if(location.name === 'Remote') {
            this.validatedLocation.push({remote: true, visa_needed : location.visa_needed });
          }

        }
        this.volunteer.locations = this.validatedLocation;
      }
      if(!this.volunteer.roles || (this.volunteer.roles && this.volunteer.roles.length<=0)) {
        this.volunteer_roles_log = "Please select minimum one role";
        volunteerCount=1;
      }
      if(!this.volunteer.learning_objectives) {
        this.objective_log = "Please enter learning objectives";
        volunteerCount=1;
      }
    }

    if(visaRequired === 1){
      remote_error_count = 1;
      this.remote_location_log = "Please select at least one location which you can work in without needing a visa";
    }

    /*if(this.current_salary && !this.current_currency ) {
      this.current_currency_log = "Please choose currency";
      this.count++;
    }

    if(this.current_salary && this.current_currency === "Currency" ) {
      this.current_currency_log = "Please choose currency";
      this.count++;
    }

    if(!this.current_salary && this.current_currency !== "Currency") {
      this.current_sal_log = "Please enter current base salary";
      this.count++;
    }

    if((!this.current_salary && !this.current_currency) || (!this.current_salary && this.current_currency === "Currency")){
      this.count = 0;
    }*/

    if(!this.candJobActivity.selfValidate()) this.count++;

    if(this.candJobActivity.jobActivity === 'Not now'){}
    else{
      if(!this.candJobActivity.currentEmploymentValidate()) this.count++;
      if(this.candJobActivity.currentEmploy === 'Yes') {
        if (!this.candJobActivity.validateReasons()) this.count++;
        if(this.candJobActivity.reasonsOfLeaving.find((obj => obj === 'Other')))
          if (!this.candJobActivity.selfValidateOtherReasons()) this.count++;

        if (!this.candJobActivity.validateCounterOffer()) this.count++;
      }
    }

    if(remote_error_count === 0 && this.count === 0 && (this.employeeCheck || this.contractorCheck || this.volunteerCheck)
      && employeeCount === 0 && contractorCount === 0 && volunteerCount === 0)
    {
      if(this.employeeCheck) {
        candidateQuery.employee = {
          employment_type : this.employee.employment_type,
          expected_annual_salary: parseInt(this.employee.expected_annual_salary),
          currency: this.employee.currency,
          location: this.employee.locations,
          roles: this.employee.roles,
          employment_availability: this.employee.employment_availability
        }
      }
      else inputQuery.unset_employee = true;


      if(this.contractorCheck) {
        candidateQuery.contractor = {
          expected_hourly_rate : parseInt(this.contractor.hourly_rate),
          currency: this.contractor.currency,
          location: this.contractor.locations,
          roles: this.contractor.roles,
          contractor_type: this.contractor.contractor_type,
          service_description : this.contractor.service_description
        }
        if(this.contractor.agency_website) candidateQuery.contractor.agency_website = this.contractor.agency_website;
        if(this.contractor.max_hour_per_week && this.contractor.max_hour_per_week !== '-1') candidateQuery.contractor.max_hour_per_week = parseInt(this.contractor.max_hour_per_week);
      }
      else inputQuery.unset_contractor = true;

      if(this.volunteerCheck) {
        candidateQuery.volunteer = {
          location: this.volunteer.locations,
          roles: this.volunteer.roles,
          learning_objectives : this.volunteer.learning_objectives
        }
        if(this.volunteer.max_hours_per_week && this.volunteer.max_hours_per_week !== '-1') {
          candidateQuery.volunteer.max_hours_per_week = parseInt(this.volunteer.max_hours_per_week);
        }
      }
      else inputQuery.unset_volunteer = true;

      if(this.current_salary) candidateQuery.current_salary = parseInt(this.current_salary);
      if(this.current_currency) candidateQuery.current_currency = this.current_currency;

      job_activity_statuses.new_work_opportunities = this.candJobActivity.jobActivity;
      if(this.candJobActivity.jobActivity !== 'Not now' && this.candJobActivity.currentEmploy) job_activity_statuses.currently_employed = this.candJobActivity.currentEmploy;
      else inputQuery.unset_currently_employed = true;

      if(this.candJobActivity.jobActivity !== 'Not now' && this.candJobActivity.currentEmploy === 'Yes' && this.candJobActivity.reasonsOfLeaving && this.candJobActivity.reasonsOfLeaving.length > 0) job_activity_statuses.leaving_current_employ_reasons = this.candJobActivity.reasonsOfLeaving;
      else inputQuery.unset_leaving_current_employ_reasons = true;

      if(this.candJobActivity.jobActivity !== 'Not now' && this.candJobActivity.currentEmploy === 'Yes' && this.candJobActivity.otherReasons) job_activity_statuses.other_reasons = this.candJobActivity.otherReasons;
      else inputQuery.unset_other_reasons = true;

      if(this.candJobActivity.jobActivity !== 'Not now' && this.candJobActivity.currentEmploy === 'Yes' && this.candJobActivity.counterOffer) job_activity_statuses.counter_offer = this.candJobActivity.counterOffer;
      else inputQuery.unset_counter_offer = true;

      candidateQuery.job_activity_status = job_activity_statuses;
      inputQuery.candidate = candidateQuery;

      inputQuery.wizardNum = 3;

      this.authenticationService.edit_candidate_profile(this.currentUser._creator , inputQuery, false)

        .subscribe(
          data => {
            if (data) {
              this.router.navigate(['/resume']);
            }
          },
          error => {
            if (error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false) {
              localStorage.setItem('jwt_not_found', 'Jwt token not found');
              localStorage.removeItem('currentUser');
              localStorage.removeItem('googleUser');
              localStorage.removeItem('close_notify');
              localStorage.removeItem('linkedinUser');
              localStorage.removeItem('admin_log');
              window.location.href = '/login';
            }
          }
        );


    }
    else{
      this.error_msg = "One or more fields need to be completed. Please scroll up to see which ones.";
    }
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
              this.cities = this.filter_array(citiesOptions);

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
    return this.cities;
  }

  updateCitiesOptions(input, check,array) {
    let objIndex = array.findIndex((obj => obj.name === input));
    array[objIndex].visa_needed = check;
    return array;

  }

  deleteLocationRow(array, index){
    array.splice(index, 1);
  }

  filter_array(arr) {
    var hashTable = {};

    return arr.filter(function (el) {
      var key = JSON.stringify(el);
      var match = Boolean(hashTable[key]);

      return (match ? false : hashTable[key] = true);
    });
  }

  workTypeChange(event) {

    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh');
    }, 300);
    if(event.target.checked)
    {
      this.selected_work_type.push(event.target.value);
    }
    else{
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

  employeeSelectedValueFunction(e) {
    if(this.cities) {
      const citiesExist = this.cities.find(x => x.name === e);
      if(citiesExist) {
        this.employee.country = '';
        this.cities = [];
        if(this.selectedValueArray.length > 9) {
          this.error = 'You can select maximum 10 locations';
          setInterval(() => {
            this.error = "" ;
          }, 5000);
        }
        else {
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
        this.employee.selectedLocation = this.selectedValueArray;
      }
    }

  }

  employeeUpdateCitiesOptions(event) {
    this.updateCitiesOptions(event.target.value ,event.target.checked, this.employee.selectedLocation );

  }

  employeeDeleteLocationRow(index){
    this.deleteLocationRow(this.employee.selectedLocation, index);
  }

  contractorArray = [];
  contractorSelectedValueFunction(e) {
    if(this.cities) {
      const citiesExist = this.cities.find(x => x.name === e);
      if(citiesExist) {
        this.contractor.country = '';
        this.cities = [];
        if(this.contractorArray.length > 9) {
          this.error = 'You can select maximum 10 locations';
          setInterval(() => {
            this.error = "" ;
          }, 5000);
        }
        else {
          if(this.contractorArray.find(x => x.name === e)) {
            this.error = 'This location has already been selected';
            setInterval(() => {
              this.error = "" ;
            }, 4000);
          }

          else {
            if(citiesExist) this.contractorArray.push({_id:citiesExist._id ,  name: e, visa_needed:false});
            else this.contractorArray.push({ name: e, visa_needed:false});
          }


        }


      }
      if(this.contractorArray.length > 0) {
        this.contractorArray.sort(function(a, b){
          if(a.name < b.name) { return -1; }
          if(a.name > b.name) { return 1; }
          return 0;
        })
        if(this.contractorArray.find((obj => obj.name === 'Remote'))) {
          let remoteValue = this.contractorArray.find((obj => obj.name === 'Remote'));
          this.contractorArray.splice(0, 0, remoteValue);
          this.contractorArray = this.filter_array(this.contractorArray);

        }
        this.contractor.selectedLocation = this.contractorArray;
      }
    }

  }
  contractorUpdateCitiesOptions(event) {
    this.updateCitiesOptions(event.target.value ,event.target.checked, this.contractor.selectedLocation );

  }
  contractorDeleteLocationRow(index){
    this.deleteLocationRow(this.contractor.selectedLocation, index);
  }


  volunteerArray = [];
  volunteerSelectedValueFunction(e) {
    if(this.cities) {
      const citiesExist = this.cities.find(x => x.name === e);

      if(citiesExist) {

        this.volunteer.country = '';
        this.cities = [];
        if(this.volunteerArray.length > 9) {
          this.error = 'You can select maximum 10 locations';
          setInterval(() => {
            this.error = "" ;
          }, 5000);
        }
        else {
          if(this.volunteerArray.find(x => x.name === e)) {
            this.error = 'This location has already been selected';
            setInterval(() => {
              this.error = "" ;
            }, 4000);
          }

          else {
            if(citiesExist) this.volunteerArray.push({_id:citiesExist._id ,  name: e, visa_needed:false});
            else this.volunteerArray.push({ name: e, visa_needed:false});
          }


        }


      }
      if(this.volunteerArray.length > 0) {
        this.volunteerArray.sort(function(a, b){
          if(a.name < b.name) { return -1; }
          if(a.name > b.name) { return 1; }
          return 0;
        })
        if(this.volunteerArray.find((obj => obj.name === 'Remote'))) {
          let remoteValue = this.volunteerArray.find((obj => obj.name === 'Remote'));
          this.volunteerArray.splice(0, 0, remoteValue);
          this.volunteerArray = this.filter_array(this.volunteerArray);

        }
        this.volunteer.selectedLocation = this.volunteerArray;
      }
    }

  }
  volunteerUpdateCitiesOptions(event) {
    this.updateCitiesOptions(event.target.value ,event.target.checked, this.volunteer.selectedLocation );

  }
  volunteerDeleteLocationRow(index){
    this.deleteLocationRow(this.volunteer.selectedLocation, index);
  }

  populateRoles(value, array) {
    if(array && array.find((obj => obj === value))) return true;
    else false
  }
}

