import { Component, OnInit , AfterViewInit, AfterViewChecked, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
import { HttpClient } from '@angular/common/http';
import {NgForm,FormGroup,FormControl,FormBuilder,FormArray} from '@angular/forms';
declare var $:any;
import {constants} from '../../../constants/constants';
import {isPlatformBrowser} from "@angular/common";
import {SkillsAutoSuggestComponent} from '../../L1-items/users/skills-auto-suggest/skills-auto-suggest.component';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild(SkillsAutoSuggestComponent) skillsAutoSuggestComp: SkillsAutoSuggestComponent;

  preferncesForm : FormGroup;
  saved_searches=[];
  location_log;
  job_type_log;
  position_log;
  current_currency_log;
  current_salary_log;
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
  other_technologies;
  pref_active_class;
  cities;
  selectedValueArray=[];
  error;
  selectedLocations;
  emptyInput;
  workTypes = constants.workTypes;
  expected_hourly_rate_log;
  locationArray = [];price_plan_active_class;pricing_disable;
  gdpr_compliance_active_class;gdpr_disable;
  commercialSkillsFromDB = [];selectedCommercialSkillsNew = [];
  skills_auto_suggest_error;skills_auto_suggest_years_error;

  constructor(private _fb: FormBuilder,private route: ActivatedRoute, private http: HttpClient, private router: Router, private authenticationService: UserService,@Inject(PLATFORM_ID) private platformId: Object) {
  }

  ngAfterViewInit() {
    window.scrollTo(0, 0);
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        $('.selectpicker').selectpicker();
      }, 300);

      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh');
      }, 900);
    }
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
      other_technologies: [''],
      residence_country: [''],
      requiredSkills: []
    });
  }

  private preferncesFormData(): FormGroup[]
  {
    return this.prefData
      .map(i => this._fb.group({ work_type: i.work_type , currency: i.current_currency, expected_hourly_rate: i.expected_hourly_rate, residence_country: [i.residence_country], name: i.name, location: this.selectedCompanyLocation(i.location) , visa_needed : i.visa_needed, job_type: [i.job_type], position: [i.position], current_currency: i.current_currency, current_salary: i.current_salary, other_technologies: i.other_technologies, requiredSkills: i.requiredSkills } ));
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
  email_notificaiton = constants.email_notificaiton;
  prefData;
  when_receive_email_notitfications;

  ngOnInit() {
    this.pricing_disable = "disabled";
    $('.selectpicker').selectpicker('refresh');
    this.gdpr_disable = 'disabled';
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
      });

      this.preferncesForm = new FormGroup({
        name :  new FormControl(),
        location: new FormControl(),
        visa_needed: new FormControl(),
        job_type: new FormControl(),
        position: new FormControl(),
        current_currency: new FormControl(),
        current_salary: new FormControl(),
        other_technologies: new FormControl(),
        when_receive_email_notitfications: new FormControl(),
        residence_country: new FormControl(),
        expected_hourly_rate: new FormControl(),
        currency: new FormControl(),
        work_type: new FormControl(),
        requiredSkills: new FormControl()
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
              this.pref_active_class = 'fa fa-check-circle text-success';
              setTimeout(() => {
                $('.selectpicker').selectpicker();
                $('.selectpicker').selectpicker('refresh');
              }, 500);
              this.prefData = data['saved_searches'];
              for(let saved_search of this.prefData){
                this.commercialSkillsFromDB.push(saved_search.required_skills);
              }
              console.log(this.commercialSkillsFromDB);

              this.preferncesForm = this._fb.group({
                prefItems: this._fb.array(
                  this.preferncesFormData()
                )
              });
              if (isPlatformBrowser(this.platformId)) {
                setTimeout(() => {
                  $('.selectpicker').selectpicker('refresh');
                }, 400);
              }

            }
            if(data['pricing_plan']) {
              this.pricing_disable = '';
              this.price_plan_active_class = 'fa fa-check-circle text-success';
            }


            if(constants.eu_countries.indexOf(data['company_country']) === -1) {
              if ((data['canadian_commercial_company'] === true || data['canadian_commercial_company'] === false) || (data['usa_privacy_shield'] === true || data['usa_privacy_shield'] === false) || data['dta_doc_link']) {
                this.gdpr_disable = '';
                this.gdpr_compliance_active_class = 'fa fa-check-circle text-success';
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
  language_log;
  exp_year_log;
  work_type_log;
  annual_salary_log;
  hourly_log;
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

    //new code for auto suggest skills starts
    this.skills_auto_suggest_years_error = '';
    if(this.commercialSkillsFromDB.length !== this.preferncesForm.value.prefItems.length){
      console.log('new search item added');
      for(let i=0;i<this.preferncesForm.value.prefItems.length; i++) {
        let skillsAdded = [];
        this.preferncesForm.value.prefItems[i].requiredSkills = [];
        if(i==0 && this.commercialSkillsFromDB.length > 0) {
          console.log('in i if');
          if(this.commercialSkillsFromDB.length > 0) {
            for (let skill of this.commercialSkillsFromDB[i]) {
              if (skill.exp_year) {
                skillsAdded.push({
                  skills_id: skill.skills_id,
                  name: skill.name,
                  type: skill.type,
                  exp_year: skill.exp_year
                });
              }
              else count = 1;
            }
          }
          else {
            this.skills_auto_suggest_error = 'Please select atleast one skill';
            count = 1;
          }
          if(skillsAdded && skillsAdded.length > 0)
            this.preferncesForm.value.prefItems[i].requiredSkills.push(skillsAdded);
        }
        else {
          if(this.selectedCommercialSkillsNew.length < this.preferncesForm.value.prefItems.length){
            this.skills_auto_suggest_error = 'Please select atleast one skill';
            count = 1;
          }
          else {
            console.log('selected');
            if(this.selectedCommercialSkillsNew[i] && this.selectedCommercialSkillsNew[i].length > 0) {
              for (let skill of this.selectedCommercialSkillsNew[i]) {
                if (skill.exp_year) {
                  skillsAdded.push({
                    skills_id: skill.skills_id,
                    name: skill.name,
                    type: skill.type,
                    exp_year: skill.exp_year
                  });
                }
                else {
                  console.log('in else');
                  this.skills_auto_suggest_years_error = 'Please select number of years';
                  count = 1;
                }
              }
            }
            if(skillsAdded && skillsAdded.length > 0)
              this.preferncesForm.value.prefItems[i].requiredSkills.push(skillsAdded);
          }
        }
      }
      console.log(this.selectedCommercialSkillsNew[0]);
      console.log(this.selectedCommercialSkillsNew);
      console.log(this.commercialSkillsFromDB);
    }
    else {
      console.log('old search item');
      console.log(this.selectedCommercialSkillsNew);
      console.log(this.commercialSkillsFromDB[0]);
      let skillsAdded = [];
      if(this.selectedCommercialSkillsNew.length === 0) {
        console.log('in 0 if');
        for (let i = 0; i < this.preferncesForm.value.prefItems.length; i++) {
          this.preferncesForm.value.prefItems[i].requiredSkills = [];
          if(this.commercialSkillsFromDB[i].length > 0) {
            for (let skill of this.commercialSkillsFromDB[i]) {
              if (skill.exp_year) {
                skillsAdded.push({
                  skills_id: skill.skills_id,
                  name: skill.name,
                  type: skill.type,
                  exp_year: skill.exp_year
                });
              }
              else {
                this.skills_auto_suggest_error = 'Please select number of years';
                count = 1;
              }
            }
          }
          else {
            this.skills_auto_suggest_error = 'Please select atleast one skill';
            count = 1;
          }

          this.preferncesForm.value.prefItems[i].requiredSkills.push(skillsAdded);
        }
      }
      else{
        console.log('do mapping using selectedCommercialSkillsNew obj');
        for (let i = 0; i < this.preferncesForm.value.prefItems.length; i++) {
          this.preferncesForm.value.prefItems[i].requiredSkills = [];
          if(this.selectedCommercialSkillsNew[i].length > 0) {
            for (let skill of this.selectedCommercialSkillsNew[i]) {
              if (skill.exp_year) {
                skillsAdded.push({
                  skills_id: skill.skills_id,
                  name: skill.name,
                  type: skill.type,
                  exp_year: skill.exp_year
                });
              }
              else {
                this.skills_auto_suggest_error = 'Please select number of years';
                count = 1;
              }
            }
          }
          else {
            this.skills_auto_suggest_error = 'Please select atleast one skill';
            count = 1;
          }

          this.preferncesForm.value.prefItems[i].requiredSkills.push(skillsAdded);
        }
      }
      console.log(this.preferncesForm.value.prefItems);
    }
    //new code for auto suggest skills ends

    if(this.preferncesForm.value.prefItems.length > 0) {
      for(let i=0 ; i<this.preferncesForm.value.prefItems.length; i++) {

        if(!this.preferncesForm.value.prefItems[i].name) {
          this.name_log = "Please enter saved search name";
          count=1;
        }

        if(!this.preferncesForm.value.prefItems[i].work_type) {
          this.work_type_log = "Please select work type";
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
            this.hourly_log = "Hourly rate should be a number "
          }
        }

        if(this.preferncesForm.value.prefItems[i].work_type === 'employee') {
          if(!this.preferncesForm.value.prefItems[i].current_salary) {
            this.annual_salary_log = "Please enter current salary";
            count=1;
          }
          if(this.preferncesForm.value.prefItems[i].current_salary){
            if(this.preferncesForm.value.prefItems[i].current_currency === 'Currency' || !this.preferncesForm.value.prefItems[i].current_currency){
              this.current_currency_log = "Please choose currency ";
              count = 1;
            }
          }
        }

        if(this.preferncesForm.value.prefItems[i].work_type === 'contractor'){
          if(!this.preferncesForm.value.prefItems[i].expected_hourly_rate) {
            this.hourly_log = 'Please enter hourly rate';
            count = 1;
          }
          if(this.preferncesForm.value.prefItems[i].expected_hourly_rate){
            if(!this.preferncesForm.value.prefItems[i].currency || this.preferncesForm.value.prefItems[i].currency === 'Currency') {
              this.expected_hourly_rate_log = "Please choose currency ";
              count = 1;
            }
          }
        }

        if(this.preferncesForm.value.prefItems[i].residence_country && this.preferncesForm.value.prefItems[i].residence_country.length > 50) {
          this.residence_country_log = "Please select maximum 50 countries";
          count=1;
        }
        if(!this.preferncesForm.value.prefItems[i].residence_country || (this.preferncesForm.value.prefItems[i].residence_country && this.preferncesForm.value.prefItems[i].residence_country.length <= 0)) {
          this.residence_country_log = "Please select residence country";
          count=1;
        }
      }
    }

    if(count === 0) {
      let inputQuery : any ={};
      if(this.preferncesForm.value.prefItems && this.preferncesForm.value.prefItems.length > 0) {
        let i = 0;
        for (let key of this.preferncesForm.value.prefItems) {
          let searchInput : any = {};
          if(key['visa_needed']) searchInput.visa_needed = key['visa_needed'];
          else searchInput.visa_needed = false;
          if(key['job_type']) searchInput.job_type = key['job_type'];
          if(key['position']) searchInput.position = key['position'];
          if(key['residence_country']) searchInput.residence_country = key['residence_country'];
          searchInput.location = this.validatedLocation;

          if(key['name']) searchInput.name = key['name'];

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
          if(key['requiredSkills'] && key['requiredSkills'].length > 0) searchInput.required_skills = key['requiredSkills'][0];
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
              this.router.navigate(['/users/company/wizard/pricing']);
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
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh');
      }, 300);
    }
  }

  get DynamicWorkFormControls()
  {
    return <FormArray>this['preferncesForm'].get('prefItems');
  }

  addNewSearch()
  {
    this.skills_auto_suggest_error = '';
    this.skills_auto_suggest_years_error = '';
    setTimeout(() => {
      $('.selectpicker').selectpicker('');
      $('.selectpicker').selectpicker('refresh');
    }, 100);
    const control = <FormArray>this.preferncesForm.controls['prefItems'];
    control.push(this.initPrefRows());
  }

  deletePrefRow(index: number) {
    const control = <FormArray>this.preferncesForm.controls['prefItems'];
    control.removeAt(index);
  }

}
