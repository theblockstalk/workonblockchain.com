import { Component, OnInit , AfterViewInit, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
import { HttpClient } from '@angular/common/http';
import {NgForm,FormGroup,FormControl,FormBuilder } from '@angular/forms';
declare var $:any;
import {constants} from '../../../constants/constants';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit, AfterViewInit, AfterViewChecked {
  preferncesForm : FormGroup;
  saved_searches=[];
  location_log;
  job_type_log;
  position_log;
  current_currency_log;
  current_salary_log;
  blockchain_log;
  skills_log;
  email_notification_log;
  error_msg;
  log;
  currentUser: any;
  about_active_class;
  terms_active_class;
  companyMsgTitle;
  companyMsgBody;
  positionSelected = [];
  current_salary;
  locationSelected = [];
  jobTypesSelected = [];
  index;
  blockchainSelected = [];
  order_preferences= [];
  languageSelected = [];
  other_technologies;
  pref_active_class;
  cities;
  selectedValueArray=[];
  error;
  selectedLocations;
  emptyInput;
  workTypes = constants.workTypes;
  expected_hourly_rate_log;

  constructor(private _fb: FormBuilder,private route: ActivatedRoute, private http: HttpClient, private router: Router, private authenticationService: UserService) {
  }

  ngAfterViewInit() {
    window.scrollTo(0, 0);
    setTimeout(() => {
      $('.selectpicker').selectpicker();
    }, 300);

    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh');
    }, 900);
  }

  ngAfterViewChecked() {

  }

  residenceCountries = constants.countries;
  job_types = constants.job_type;
  roles = constants.workRoles;
  currency = constants.currencies;
  blockchain = constants.blockchainPlatforms;
  language_opt = constants.programmingLanguages;
  email_notificaiton = constants.email_notificaiton;
  years_exp = constants.years_exp_min;

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(!this.currentUser) {
      this.router.navigate(['/login']);
    }
    else if(this.currentUser && this.currentUser.type === 'company') {
      this.job_types.sort(function(a, b){
        if(a < b) { return -1; }
        if(a > b) { return 1; }
        return 0;
      })

      this.roles.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })

      this.blockchain.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })

      this.language_opt.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })


      this.preferncesForm = new FormGroup({
        name :  new FormControl(),
        location: new FormControl(),
        visa_needed: new FormControl(),
        job_type: new FormControl(),
        position: new FormControl(),
        current_currency: new FormControl(),
        current_salary: new FormControl(),
        blockchain: new FormControl(),
        skills: new FormControl(),
        other_technologies: new FormControl(),
        when_receive_email_notitfications: new FormControl(),
        order_preferences: new FormControl(),
        residence_country: new FormControl(),
        expected_hourly_rate: new FormControl(),
        currency: new FormControl(),
        work_type: new FormControl(),
        years_exp_min: new FormControl()
      });

      this.preferncesForm = this._fb.group({
        name: [''],
        location: [],
        visa_needed: [false],
        job_type: [],
        position: [],
        current_currency: [],
        current_salary: [''],
        blockchain: [],
        skills: [],
        other_technologies: [''],
        when_receive_email_notitfications: [''],
        order_preferences: [],
        residence_country: [],
        expected_hourly_rate:[''],
        currency: [''],
        work_type: [''],
        years_exp_min: []
      });
      this.authenticationService.getCurrentCompany(this.currentUser._id)
        .subscribe(
          data =>
          {
            if(data['terms_id'])
            {
              this.terms_active_class = 'fa fa-check-circle text-success';
            }
            if(data['company_founded'] && data['no_of_employees'] && data['company_funded'] && data['company_description'])
            {
              this.about_active_class = 'fa fa-check-circle text-success';
            }
            if(data['saved_searches'] && data['saved_searches'].length > 0) {
              this.pref_active_class = 'fa fa-check-circle text-success';
              this.preferncesForm = this._fb.group({
                name: [data['saved_searches'][0].name],
                location: [],
                visa_needed: [data['saved_searches'][0].visa_needed],
                job_type: [data['saved_searches'][0].job_type],
                position: [data['saved_searches'][0].position],
                current_currency: [data['saved_searches'][0].current_currency],
                current_salary: [data['saved_searches'][0].current_salary],
                blockchain: [data['saved_searches'][0].blockchain],
                skills: [data['saved_searches'][0].skills],
                other_technologies: [data['saved_searches'][0].other_technologies],
                when_receive_email_notitfications: [data['when_receive_email_notitfications']],
                order_preferences: [data['saved_searches'][0].order_preferences],
                residence_country: [data['saved_searches'][0].residence_country],
                expected_hourly_rate: [data['saved_searches'][0].expected_hourly_rate],
                currency: [data['saved_searches'][0].current_currency],
                work_type: [data['saved_searches'][0].work_type],
                years_exp_min: [data['saved_searches'][0].years_exp_min],
              });

              if(data['saved_searches'][0].location)
              {
                for (let country1 of data['saved_searches'][0].location)
                {
                  if (country1['remote'] === true) {
                    this.selectedValueArray.push({name: 'Remote' , visa_needed : country1.visa_needed});
                  }

                  if (country1['city']) {
                    let city = country1['city'].city + ", " + country1['city'].country;
                    this.selectedValueArray.push({_id:country1['city']._id ,name: city , visa_needed : country1.visa_needed});
                  }
                }

                this.selectedValueArray.sort();
                if(this.selectedValueArray.find((obj => obj.name === 'Remote'))) {
                  let remoteValue = this.selectedValueArray.find((obj => obj.name === 'Remote'));
                  this.selectedValueArray.splice(0, 0, remoteValue);
                  this.selectedValueArray = this.filter_array(this.selectedValueArray);

                }
                this.selectedLocations = this.selectedValueArray;
              }
              for (let job_types of data['saved_searches'][0].job_type) {
                for(let option of this.job_types) {
                  if(option === job_types ) {
                    this.jobTypesSelected.push(option);
                  }
                }
              }
              for (let positions of data['saved_searches'][0].position) {
                for(let option of this.roles) {
                  if(option.name === positions ) {
                    this.positionSelected.push(option.name);
                  }
                }
              }
              if(data['saved_searches'][0].blockchain && data['saved_searches'][0].blockchain.length > 0) {
                for(let blockchains of data['saved_searches'][0].blockchain) {
                  for(let option of this.blockchain) {
                    if(option.name === blockchains) {
                      this.blockchainSelected.push(option.name);
                    }
                  }
                }
              }

              if(data['saved_searches'][0].order_preferences && data['saved_searches'][0].order_preferences.length > 0) {
                for(let blockchains of data['saved_searches'][0].blockchain) {
                  for(let option of this.blockchain) {
                    if(option.name === blockchains) {
                      this.order_preferences.push(option.name);
                    }
                  }
                }
              }

              if(data['saved_searches'][0].skills && data['saved_searches'][0].skills.length > 0) {
                for(let skills of data['saved_searches'][0].skills) {
                  for(let option of this.language_opt) {
                    if(option.name === skills) {
                      this.languageSelected.push(option.name);
                    }
                  }
                }
              }
            }

          },
          error =>
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

            if(error['message'] === 403)
            {
               this.router.navigate(['/not_found']);
            }
          });

      this.authenticationService.get_page_content('Company popup message')
        .subscribe(
          data => {
            if(data && data[0])
            {
              this.companyMsgTitle= data[0]['page_title'];
              this.companyMsgBody = data[0]['page_content'];
            }
          });
    }
    else {
      this.router.navigate(['/not_found']);
    }



  }
  validatedLocation=[];
  country_input_log;
  country_log;
  residence_country_log;
  name_log;

  checkNumber(salary) {
    return /^[0-9]*$/.test(salary);
  }

  candidate_prefernces() {
    this.saved_searches = [];
    this.error_msg = "";
    this.validatedLocation = [];
    let count = 0;
    if(!this.selectedValueArray || this.selectedValueArray.length <= 0) {
      this.country_input_log = "Please select at least one location";
      count=1;
    }
    if(!this.selectedLocations) {
      this.country_log = "Please select at least one location";
      count=1;
    }
    if(this.selectedLocations && this.selectedLocations.length > 0) {
      for(let location of this.selectedLocations) {
        if(location.name.includes(', ')) {
          this.validatedLocation.push({city: location._id });
        }
        if(location.name === 'Remote') {
          this.validatedLocation.push({remote: true });
        }
      }
    }

    if(this.selectedLocations && this.selectedLocations.length > 10) {
      this.country_log = "Please select maximum 10 locations";
      count=1;
    }

    if(!this.preferncesForm.value.name) {
      this.name_log = "Please enter saved search name";
      count=1;
    }

    if(!this.preferncesForm.value.position || this.preferncesForm.value.position.length === 0) {
      this.position_log = "Please select roles";
      count=1;
    }

    /*if(this.preferncesForm.value !this.preferncesForm.value.current_currency) {
      this.current_currency_log = "Please select available annual salary and currency";
    }
    if(!this.preferncesForm.value.current_salary) {
      this.current_currency_log = "Please select available annual salary and currency";
    }
    if(this.preferncesForm.value.current_salary && !Number(this.preferncesForm.value.current_salary)){
      this.current_currency_log = "Salary should be a number";
    }*/
    if(!this.preferncesForm.value.when_receive_email_notitfications) {
      this.email_notification_log = "Please select when you want to receive email notification";
      count=1;
    }

    if(this.preferncesForm.value.work_type === 'employee' && this.preferncesForm.value.current_salary && this.preferncesForm.value.current_currency) {
      const checkNumber = this.checkNumber(this.preferncesForm.value.current_salary);
      if(checkNumber === false) {
        count = 1;
        this.current_currency_log = "Salary should be a number";
      }
    }

    if(this.preferncesForm.value.work_type === 'contractor' && this.preferncesForm.value.expected_hourly_rate && this.preferncesForm.value.currency) {
      const checkNumber = this.checkNumber(this.preferncesForm.value.expected_hourly_rate);
      if(checkNumber === false) {
        count = 1;
        this.expected_hourly_rate_log = "Hourly rate should be a number "
      }
    }
    if(this.preferncesForm.value.work_type === 'employee' && this.preferncesForm.value.current_salary && !this.preferncesForm.value.current_currency) {
      this.current_currency_log = "Please choose currency ";
      count = 1;
    }

    if(this.preferncesForm.value.work_type === 'employee' && !this.preferncesForm.value.current_salary && this.preferncesForm.value.current_currency) {
      this.current_currency_log = "Please enter expected hours ";
      count = 1;
    }

    if(this.preferncesForm.value.work_type === 'contractor' && this.preferncesForm.value.expected_hourly_rate && !this.preferncesForm.value.currency) {
      this.expected_hourly_rate_log = "Please choose currency ";
      count = 1;
    }

    if(this.preferncesForm.value.work_type === 'contractor' && !this.preferncesForm.value.expected_hourly_rate && this.preferncesForm.value.currency) {
      this.expected_hourly_rate_log = "Please enter expected hours ";
      count = 1;
    }

    if(this.preferncesForm.value.residence_country && this.preferncesForm.value.residence_country.length > 50) {
      this.residence_country_log = "Please select maximum 50 countries";
      count=1;
    }
    if(count === 0) {
      this.preferncesForm.value.location = this.validatedLocation;
      this.preferncesForm.value.current_salary = Number(this.preferncesForm.value.current_salary);
      if(!this.preferncesForm.value.job_type) this.preferncesForm.value.job_type = [];
      if(!this.preferncesForm.value.blockchain) this.preferncesForm.value.blockchain = [];
      if(!this.preferncesForm.value.skills) this.preferncesForm.value.skills = [];
      if(!this.preferncesForm.value.order_preferences) this.preferncesForm.value.order_preferences = [];
      if(!this.preferncesForm.value.residence_country) this.preferncesForm.value.residence_country = [];
      if(!this.preferncesForm.value.years_exp_min) this.preferncesForm.value.years_exp_min = [];

      let inputQuery : any ={};
      inputQuery.when_receive_email_notitfications = this.preferncesForm.value.when_receive_email_notitfications;

      let searchInput : any = {};
      if(this.preferncesForm.value.location) searchInput.location = this.preferncesForm.value.location;
      if(this.preferncesForm.value.name) searchInput.name = this.preferncesForm.value.name;
      if(this.preferncesForm.value.years_exp_min && this.preferncesForm.value.years_exp_min.length>0) searchInput.years_exp_min = this.preferncesForm.value.years_exp_min;
      if(this.preferncesForm.value.visa_needed) searchInput.visa_needed = this.preferncesForm.value.visa_needed;
      if(this.preferncesForm.value.work_type === 'employee' && this.preferncesForm.value.job_type) searchInput.job_type = this.preferncesForm.value.job_type;
      if(this.preferncesForm.value.position) searchInput.position = this.preferncesForm.value.position;
      if(this.preferncesForm.value.blockchain) searchInput.blockchain = this.preferncesForm.value.blockchain;
      if(this.preferncesForm.value.skills) searchInput.skills = this.preferncesForm.value.skills;
      if(this.preferncesForm.value.other_technologies) searchInput.other_technologies = this.preferncesForm.value.other_technologies;
      if(this.preferncesForm.value.order_preferences) searchInput.order_preferences = this.preferncesForm.value.order_preferences;
      if(this.preferncesForm.value.residence_country) searchInput.residence_country = this.preferncesForm.value.residence_country;
      if(this.preferncesForm.value.work_type === 'employee' && this.preferncesForm.value.current_salary && this.preferncesForm.value.current_currency) {
          searchInput.current_currency = this.preferncesForm.value.current_currency;
          searchInput.current_salary  = this.preferncesForm.value.current_salary;
      }

      if(this.preferncesForm.value.work_type === 'contractor' && this.preferncesForm.value.expected_hourly_rate && this.preferncesForm.value.currency) {
          searchInput.expected_hourly_rate = this.preferncesForm.value.expected_hourly_rate;
          searchInput.current_currency  = this.preferncesForm.value.currency;
      }
      if(this.preferncesForm.value.work_type) searchInput.work_type = this.preferncesForm.value.work_type;

      this.saved_searches.push(searchInput);

      inputQuery.saved_searches = this.saved_searches;

      this.authenticationService.edit_company_profile(inputQuery)
        .subscribe(
          data =>
          {
            if(data) {
              $('#whatHappensNextModal').modal('show');
            }
          },
          error => {
            if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              this.log = error['error']['message'];
              this.router.navigate(['/not_found']);
            }
            else if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              this.log = error['error']['message'];
              this.router.navigate(['/not_found']);
            }
            else {
              this.log = "Something went wrong";
            }
          })
    }
    else {
      this.error_msg = "One or more fields need to be completed. Please scroll up to see which ones.";
    }

  }

  locationSelectedOptions(name) {
    this.index = this.locationSelected.indexOf(name);
    if(this.index  > -1) {
      return 'selected';
    }
    else {
      return ;
    }

  }

  jobTypesSelectedOptions(type) {
    this.index = this.jobTypesSelected.indexOf(type);
    if(this.index > -1) {
      return 'selected';
    }
    else {
      return;
    }
  }

  positionSelectedOptions(position) {
    this.index = this.positionSelected.indexOf(position);
    if(this.index > -1) {
      return 'selected';
    }
    else {
      return;
    }
  }

  blockchainSelectedOptions(blockchainName) {
    this.index = this.blockchainSelected.indexOf(blockchainName);
    if(this.index > -1) {
      return 'selected';
    }
    else {
      return;
    }
  }

  blockchainOrderSelectedOptions(blockchainName) {
    this.index = this.order_preferences.indexOf(blockchainName);
    if(this.index > -1) {
      return 'selected';
    }
    else {
      return;
    }
  }

  languageSelectedOptions(lang) {
    if(this.preferncesForm.value.skills && this.preferncesForm.value.skills.length>0){}
    else this.preferncesForm.value.years_exp_min = '';
    this.index = this.languageSelected.indexOf(lang);
    if(this.index > -1) {
      return 'selected';
    }
    else {
      return;
    }
  }

  redirectToCompany()
  {
    $('#whatHappensNextModal').modal('hide');
    this.router.navigate(['/company_profile']);
  }


  suggestedOptions() {
    if(this.preferncesForm.value.location !== '') {
      this.error='';
      this.authenticationService.autoSuggestOptions(this.preferncesForm.value.location , true)
        .subscribe(
          data => {
            if(data) {
              let citiesInput = data;
              let citiesOptions=[];
              for(let cities of citiesInput['locations']) {
                if(cities['remote'] === true) {
                  citiesOptions.push({name: 'Remote'});
                }
                if(cities['city']) {
                  let cityString = cities['city'].city + ", " + cities['city'].country;
                  citiesOptions.push({_id : cities['city']._id , name : cityString});
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
  }

  selectedValueFunction(e) {

    if(this.cities) {
      const citiesExist = this.cities.find(x => x.name === e);
      if(citiesExist) {
        this.preferncesForm.get('location').setValue('');
        this.cities = [];
        if(this.selectedValueArray.length > 4) {
          this.error = 'You can select maximum 5 locations';
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
            if(citiesExist) this.selectedValueArray.push({_id:citiesExist._id ,  name: citiesExist.name, visa_needed:false});
            else this.selectedValueArray.push({ name: citiesExist.name, visa_needed:false});
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
        this.selectedLocations = this.selectedValueArray;
      }
    }

  }

  updateCitiesOptions(e) {
    let objIndex = this.selectedValueArray.findIndex((obj => obj.name === e.target.value));
    this.selectedValueArray[objIndex].visa_needed = e.target.checked;
    this.selectedLocations = this.selectedValueArray;

  }

  deleteLocationRow(i){
    this.selectedValueArray.splice(i, 1);
  }

  filter_array(arr) {
    var hashTable = {};

    return arr.filter(function (el) {
      var key = JSON.stringify(el);
      var match = Boolean(hashTable[key]);

      return (match ? false : hashTable[key] = true);
    });
  }

  checkValidation(value) {
    return value.filter(i => i.visa_needed === true).length;
  }

  changeWorkTypes(){
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh');
    }, 300);
  }


}
