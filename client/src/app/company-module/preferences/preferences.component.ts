import { Component, OnInit , AfterViewInit, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
import { HttpClient } from '@angular/common/http';
import {NgForm,FormGroup,FormControl,FormBuilder,FormArray} from '@angular/forms';
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
  locationArray = [];

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

  initPrefRows()
  {
    return this._fb.group({
      work_type: [''],
      expected_hourly_rate: [''],
      currency : [''],
      location: [''],
      name: [''],
      visa_needed : [false],
      job_type: [''],
      position: [''],
      current_currency: [''],
      current_salary: [''],
      blockchain: [''],
      skills: [''],
      other_technologies: [''],
      order_preferences: [''],
      residence_country: [''],
      years_exp_min: ['']
    });
  }

  private preferncesFormData(): FormGroup[]
  {
    return this.prefData
      .map(i => this._fb.group({ work_type: i.work_type , currency: i.current_currency, expected_hourly_rate: i.expected_hourly_rate, residence_country: [i.residence_country], name: i.name, location: this.selectedCompanyLocation(i.location) , visa_needed : i.visa_needed, job_type: [i.job_type], position: [i.position], current_currency: i.current_currency, current_salary: i.current_salary, blockchain: [i.blockchain], skills: [i.skills], years_exp_min: i.years_exp_min ,other_technologies: i.other_technologies, order_preferences: [i.order_preferences] } ));
  }

  selectedCompanyLocation(location) {
    this.selectedValueArray=[];
    if(location && location.length > 0) {
      for (let country1 of location)
      {
        if (country1['remote'] === true) {
          this.selectedValueArray.push({_id:country1['_id'] ,name: 'Remote' });
        }

        if (country1['city']) {
          let city = country1['city'].city + ", " + country1['city'].country;
          this.selectedValueArray.push({_id:country1['_id'] ,city:country1['city']._id ,name: city });
        }
      }

      this.selectedValueArray.sort();
      if(this.selectedValueArray.find((obj => obj.name === 'Remote'))) {
        let remoteValue = this.selectedValueArray.find((obj => obj.name === 'Remote'));
        this.selectedValueArray.splice(0, 0, remoteValue);
        this.selectedValueArray = this.filter_array(this.selectedValueArray);
      }
      this.locationArray.push(this.selectedValueArray);
      return '';
    }
    else {
      this.locationArray.push([]);
      return '';
    }
  }

  residenceCountries = constants.countries;
  job_types = constants.job_type;
  roles = constants.workRoles;
  currency = constants.currencies;
  blockchain = constants.blockchainPlatforms;
  language_opt = constants.programmingLanguages;
  email_notificaiton = constants.email_notificaiton;
  prefData;
  when_receive_email_notitfications;
  years_exp = constants.years_exp_min;

  ngOnInit() {
    $('.selectpicker').selectpicker('refresh');
    this.prefData=[];
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
        prefItems: this._fb.array([this.initPrefRows()])
      });

      this.authenticationService.getCurrentCompany(this.currentUser._id, false)
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

            this.when_receive_email_notitfications = data['when_receive_email_notitfications'];

            if(data['saved_searches'] && data['saved_searches'].length > 0) {
              setTimeout(() => {
                $('.selectpicker').selectpicker();
                $('.selectpicker').selectpicker('refresh');
              }, 500);
              this.prefData = data['saved_searches'];
              this.preferncesForm = this._fb.group({
                prefItems: this._fb.array(
                  this.preferncesFormData()
                )
              });

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
            if(data)
            {
              this.companyMsgTitle= data['page_title'];
              this.companyMsgBody = data['page_content'];
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
    if(!this.locationArray[0] || this.locationArray[0].length <= 0) {
      this.country_input_log = "Please select at least one location";
      count=1;
    }
    if(!this.locationArray[0]) {
      this.country_log = "Please select at least one location";
      count=1;
    }
    if(this.locationArray[0] && this.locationArray[0].length > 0) {
      for(let location of this.locationArray[0]) {
        if(location.name.includes(', ')) {
          this.validatedLocation.push({city: location.city});
        }
        if(location.name === 'Remote') {
          this.validatedLocation.push({remote: true });
        }
      }
    }
    if(!this.when_receive_email_notitfications) {
      this.email_notification_log = "Please select when you want to receive email notification";
      count=1;
    }

    if(this.preferncesForm.value.prefItems.length > 0) {
      for(let i=0 ; i<this.preferncesForm.value.prefItems.length; i++) {
        if(!this.preferncesForm.value.prefItems[i].name) {
          this.name_log = "Please enter saved search name";
          count=1;
        }

        if(!this.preferncesForm.value.prefItems[i].position || this.preferncesForm.value.prefItems[i].position.length === 0) {
          this.position_log = "Please select roles";
          count=1;
        }

        if(this.preferncesForm.value.prefItems[i].work_type === 'employee' && this.preferncesForm.value.prefItems[i].current_salary && this.preferncesForm.value.prefItems[i].current_currency) {
          const checkNumber = this.checkNumber(this.preferncesForm.value.prefItems[i].current_salary);
          if(checkNumber === false) {
            count = 1;
            this.current_currency_log = "Salary should be a number";
          }

        }

        if(this.preferncesForm.value.prefItems[i].work_type === 'contractor' && this.preferncesForm.value.prefItems[i].expected_hourly_rate && this.preferncesForm.value.prefItems[i].currency) {
          const checkNumber = this.checkNumber(this.preferncesForm.value.prefItems[i].expected_hourly_rate);
          if(checkNumber === false) {
            count = 1;
            this.expected_hourly_rate_log = "Hourly rate should be a number "
          }
        }
        if(this.preferncesForm.value.prefItems[i].work_type === 'employee') {
          if(this.preferncesForm.value.prefItems[i].current_salary){
            if(this.preferncesForm.value.prefItems[i].current_currency === 'Currency' || !this.preferncesForm.value.prefItems[i].current_currency){
              this.current_currency_log = "Please choose currency ";
              count = 1;
            }
          }

        }

        if(this.preferncesForm.value.prefItems[i].work_type === 'contractor'){
          if(this.preferncesForm.value.prefItems[i].expected_hourly_rate){
            if(!this.preferncesForm.value.prefItems[i].currency || this.preferncesForm.value.prefItems[i].currency === 'Currency') {
              this.expected_hourly_rate_log = "Please choose currency ";
              count = 1;
            }
          }
        }


        if(this.preferncesForm.value.prefItems[i].work_type === 'contractor' && !this.preferncesForm.value.prefItems[i].expected_hourly_rate && this.preferncesForm.value.prefItems[i].currency) {
          this.expected_hourly_rate_log = "Please enter expected hours ";
          count = 1;
        }

        if(this.preferncesForm.value.prefItems[i].residence_country && this.preferncesForm.value.prefItems[i].residence_country.length > 50) {
          this.residence_country_log = "Please select maximum 50 countries";
          count=1;
        }
      }
    }
    if(count === 0) {
      let inputQuery : any ={};
      if(this.preferncesForm.value.prefItems && this.preferncesForm.value.prefItems.length > 0) {
        let i = 0;
        let searchInput : any = {};
        for (let key of this.preferncesForm.value.prefItems) {
          if(key['visa_needed']) searchInput.visa_needed = key['visa_needed'];
          else searchInput.visa_needed = false;
          if(key['job_type']) searchInput.job_type = key['job_type'];
          if(key['position']) searchInput.position = key['position'];
          if(key['blockchain']) searchInput.blockchain = key['blockchain'];
          if(key['skills']) searchInput.skills = key['skills'];
          if(key['residence_country']) searchInput.residence_country = key['residence_country'];
          if(key['order_preferences']) searchInput.order_preferences = key['order_preferences'];
          searchInput.location = this.validatedLocation;

          if(key['name']) searchInput.name = key['name'];
          if(key['years_exp_min']) searchInput.years_exp_min = key['years_exp_min'];

          if(key['work_type']) searchInput.work_type = key['work_type'];
          if(key['work_type'] === 'employee' && key['current_currency'] && key['current_currency'] !== 'Currency' && key['current_salary']) {
            searchInput.current_currency = key['current_currency'];
            searchInput.current_salary = Number(key['current_salary']);
          }

          if(key['work_type']==='contractor' && key['currency'] && key['current_currency'] !== 'Currency' && key['expected_hourly_rate']) {
            searchInput.expected_hourly_rate = Number(key['expected_hourly_rate']);
            searchInput.current_currency = key['currency'];
          }
          if(key['other_technologies']) searchInput.other_technologies = key['other_technologies'];
          this.saved_searches.push(searchInput);
        }
      }
      inputQuery.when_receive_email_notitfications = this.when_receive_email_notitfications;
      inputQuery.saved_searches = this.saved_searches;

      this.authenticationService.edit_company_profile(this.currentUser._id, inputQuery, false)
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
    this.router.navigate(['/candidate-search']);
  }


  suggestedOptions(index) {
    if(this.preferncesForm.value.prefItems[index].location !== '') {
      this.error='';
      this.authenticationService.autoSuggestOptions(this.preferncesForm.value.prefItems[index].location , true)
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

  selectedValueFunction(locValue, index) {
    if(this.cities) {
      let citiesExist = this.cities.find(x => x.name === locValue);
      if(citiesExist) {
        ((this.preferncesForm.get('prefItems') as FormArray).at(index) as FormGroup).get('location').patchValue('');
        this.cities = [];
        if(!this.locationArray[index]) this.locationArray[index] = [];
        if(this.locationArray[index].length > 4) {
          this.error = 'You can select maximum 5 locations';
          setInterval(() => {
            this.error = "" ;
          }, 5000);
        }
        else {
          if(this.locationArray[index].find(x => x.name === locValue)) {
            this.error = 'This location has already been selected';
            setInterval(() => {
              this.error = "" ;
            }, 4000);
          }

          else {
            if(citiesExist) {
              this.locationArray[index].push({city:citiesExist._id ,  name: locValue, visa_needed:false});
            }
            else this.locationArray[index].push({ name: locValue, visa_needed:false});
          }
        }

        if(this.locationArray[index].length > 0) {
          this.locationArray[index].sort(function(a, b){
            if(a.name < b.name) { return -1; }
            if(a.name > b.name) { return 1; }
            return 0;
          })
          if(this.locationArray[index].find((obj => obj.name === 'Remote'))) {
            let remoteValue = this.locationArray[index].find((obj => obj.name === 'Remote'));
            this.locationArray[index].splice(0, 0, remoteValue);
            this.locationArray[index] = this.filter_array(this.locationArray[index]);

          }
        }
      }
    }

  }

  updateCitiesOptions(e) {
    let objIndex = this.selectedValueArray.findIndex((obj => obj.name === e.target.value));
    this.selectedValueArray[objIndex].visa_needed = e.target.checked;
    this.selectedLocations = this.selectedValueArray;

  }

  deleteLocationRow(locationIndex, index){
    this.locationArray[index].splice(locationIndex, 1);
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

  refreshSelectBox(){
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh');
    }, 300);
  }

  get DynamicWorkFormControls()
  {
    return <FormArray>this['preferncesForm'].get('prefItems');
  }

  addNewSearch()
  {
    setTimeout(() => {
      $('.selectpicker').selectpicker('');
      $('.selectpicker').selectpicker('refresh');
    }, 100);
    const control = <FormArray>this.preferncesForm.controls['prefItems'];
    control.push(this.initPrefRows());
  }

  deletePrefRow(index: number)
  {
    const control = <FormArray>this.preferncesForm.controls['prefItems'];
    control.removeAt(index);
  }

}
