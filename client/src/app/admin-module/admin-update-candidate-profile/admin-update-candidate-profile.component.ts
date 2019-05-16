import { Component, OnInit ,ElementRef, Input,AfterViewInit, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
import {NgForm} from '@angular/forms';
import { FormBuilder, FormControl, FormArray, FormGroup,Validators } from '@angular/forms';
import { DataService } from "../../data.service";
import { DatePipe } from '@angular/common';
import {constants} from '../../../constants/constants';
import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';
import {unCheckCheckboxes} from '../../../services/object';
import {isPlatformBrowser} from "@angular/common";
declare var $:any;

@Component({
  selector: 'app-admin-update-candidate-profile',
  templateUrl: './admin-update-candidate-profile.component.html',
  styleUrls: ['./admin-update-candidate-profile.component.css']
})
export class AdminUpdateCandidateProfileComponent implements OnInit,AfterViewInit {
  @Input() name: string;
  cropperSettings: CropperSettings;
  imageCropData:any;
  @ViewChild('cropper', undefined)
  cropper:ImageCropperComponent;
  user_id;
  currentUser: User;
  info: any = {}; log;
  selectedValue = [];
  selectedcountry = [];
  jobselected=[];
  salary;
  expected_salaryyy;
  availability_day;
  base_currency;
  experimented_platform = [];
  commercially_worked = [];
  platform=[];
  expYear_db=[];
  referringData;
  value;
  why_work;
  commercial_expYear=[];
  db_valye=[];
  db_lang;
  platforms=[];
  EducationForm: FormGroup;
  ExperienceForm: FormGroup;
  language=[];
  currentdate;
  currentyear;
  expYearRole=[];
  start_month;
  start_year;
  companyname;
  positionname;
  locationname;
  description;
  startdate;
  startyear;
  enddate;
  endyear;
  currentwork;
  uniname;
  degreename;
  fieldname;
  edudate;
  eduyear;
  eduData;
  jobData;
  Intro;
  current_currency;
  LangexpYear=[];
  lang_expYear_db=[];
  lang_db_valye=[];
  img_src;
  lang_log;
  exp_lang_log;
  intro_log;
  uni_name_log;
  degree_log;
  field_log;
  eduYear_log;
  company_log;
  position_log;
  location_log;
  start_date_log;
  end_date_log;
  exp_count=0;
  edu_count=0;
  why_work_log;
  country_log;
  roles_log;
  currency_log;
  salary_log;
  interest_log;
  avail_log;
  current_currency_log;
  first_name_log;
  last_name_log;
  contact_name_log;
  nationality_log;
  error_msg;
  start_date_year_log;
  end_date_year_log;
  startmonthIndex;
  endmonthIndex;
  start_date_format;
  end_date_format;
  educationjson;
  education_json_array=[];
  commercial_log;
  base_country_log;
  city_log;
  commercial_skill_log;
  current_sal_log;
  count;
  submit;
  validatedLocation=[];
  country_input_log;
  selectedValueArray=[];
  countriesModel;
  error;
  selectedLocations;
  cities;
  emptyInput;
  expected_validation;
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
  contract_type= [];
  volunteerArray=[];
  current_salary;
  contractorArray = [];
  country_code_log;
  nationality = constants.nationalities;
  current_work_check=[];
  current_work = constants.current_work;
  countries = constants.countries;
  description_commercial_platforms;
  description_experimented_platforms;
  description_commercial_skills;
  roles = constants.workRoles;
  contractor_types = constants.contractorTypes;
  employement_availability= constants.workAvailability;
  country_codes = constants.country_codes;
  imagePreviewLink;
  prefil_image;
  display_error;
  remote_location_log;

  constructor(private dataservice: DataService,private datePipe: DatePipe,private _fb: FormBuilder,private http: HttpClient,private route: ActivatedRoute,private router: Router,private authenticationService: UserService, private el: ElementRef,@Inject(PLATFORM_ID) private platformId: Object)
  {
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.noFileInput = true;
    this.cropperSettings.width = 200;
    this.cropperSettings.height = 200;
    this.cropperSettings.minWidth = 180;
    this.cropperSettings.minHeight = 180;
    this.cropperSettings.croppedWidth = 200;
    this.cropperSettings.croppedHeight = 200;
    this.cropperSettings.canvasWidth = 300;
    this.cropperSettings.canvasHeight = 300;
    this.cropperSettings.cropperDrawSettings.strokeWidth = 2;
    this.cropperSettings.cropperDrawSettings.strokeColor = 'black';
    this.cropperSettings.rounded = true;
    this.imageCropData = {};
    this.route.queryParams.subscribe(params => {
      this.user_id = params['user'];
    });
  }

  private education_data(): FormGroup[]
  {
    return this.eduData
      .map(i => this._fb.group({ uniname: i.uniname , degreename : i.degreename,fieldname:i.fieldname,eduyear:i.eduyear} ));
  }

  private history_data(): FormGroup[]
  {
    return this.jobData
      .map(i => this._fb.group({ companyname: i.companyname , positionname : i.positionname, locationname:i.locationname, description:i.description,startdate:i.startdate, start_date:this.monthNumToName(this.datePipe.transform(i.startdate, 'MM') )/*this.datePipe.transform(i.startdate, 'MM') */, startyear: this.datePipe.transform(i.startdate, 'yyyy') , enddate :i.enddate , end_date:this.monthNumToName(this.datePipe.transform(i.enddate, 'MM')) , endyear:this.datePipe.transform(i.enddate, 'yyyy') , currentwork: i.currentwork} ));
  }

  monthNumToName(monthnum) {
    return this.calen_month[monthnum-1] || '';
  }



  otherSkills = constants.otherSkills;
  skillDbArray=[];
  skillDb;
  skill_expYear_db=[];
  admin_log;
  ngOnInit()
  {
    this.contractor_types = unCheckCheckboxes(constants.contractorTypes);
    this.commercially = unCheckCheckboxes(constants.blockchainPlatforms);
    this.otherSkills = unCheckCheckboxes(constants.otherSkills);
    this.experimented = unCheckCheckboxes(constants.experimented);
    this.exp_year = unCheckCheckboxes(constants.experienceYears);
    this.area_interested = unCheckCheckboxes(constants.workBlockchainInterests);
    this.language_opt = unCheckCheckboxes(constants.programmingLanguages);
    this.roles = unCheckCheckboxes(constants.workRoles);

    this.currentyear = this.datePipe.transform(Date.now(), 'yyyy');
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    for(let i =5; i<=60; i=i+5) {
      this.max_hours.push(i);
    }
    this.admin_log = JSON.parse(localStorage.getItem('admin_log'));

    this.EducationForm = this._fb.group({
      itemRows: this._fb.array([this.initItemRows()])
    });

    this.ExperienceForm = this._fb.group({
      ExpItems: this._fb.array([this.initExpRows()])
    });
    if(this.currentUser && this.admin_log)
    {

      this.roles.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })

      this.area_interested.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })

      this.commercially.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })
      this.experimented.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })

      this.language_opt.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })
      this.otherSkills.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })

      this.authenticationService.getCandidateProfileById(this.user_id , true)
        .subscribe(data =>
          {
            if(data)
            {
              this.info.email = data['email'];
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
              if (isPlatformBrowser(this.platformId)) {
                setTimeout(() => {
                  $('.selectpicker').selectpicker('refresh');
                }, 500);
              }
              if(data['candidate'].interest_areas)
              {
                for (let interest of data['candidate'].interest_areas)
                {

                  for(let option of this.area_interested)
                  {

                    if(option.value === interest)
                    {
                      option.checked=true;
                      this.selectedValue.push(interest);

                    }

                  }

                }
              }

              if(data['contact_number']  || data['nationality'] || data['first_name'] || data['last_name'] || data['candidate'])
              {
                this.info.contact_number = '';
                let contact_number = data['contact_number'];
                contact_number = contact_number.replace(/^00/, '+');
                contact_number = contact_number.split(" ");
                if(contact_number.length>1) {
                  for (let i = 0; i < contact_number.length; i++) {
                    if (i === 0) this.info.country_code = contact_number[i];
                    else this.info.contact_number = this.info.contact_number+''+contact_number[i];
                  }
                }
                else this.info.contact_number = contact_number[0];

                if(data['candidate'].github_account) this.info.github_account = data['candidate'].github_account;
                if(data['candidate'].stackexchange_account) this.info.exchange_account = data['candidate'].stackexchange_account;
                if(data['candidate'].linkedin_account) this.info.linkedin_account = data['candidate'].linkedin_account;
                if(data['candidate'].medium_account) this.info.medium_account = data['candidate'].medium_account;
                if(data['candidate'].stackoverflow_url) this.info.stackoverflow_url = data['candidate'].stackoverflow_url;
                if(data['candidate'].personal_website_url) this.info.personal_website_url = data['candidate'].personal_website_url;

                this.info.nationality = data['nationality'];
                this.info.first_name =data['first_name'];
                this.info.last_name =data['last_name'];
                if (isPlatformBrowser(this.platformId)) {
                  setTimeout(() => {
                    $('.selectpicker').selectpicker('refresh');
                  }, 200);
                }

                if(data['image'] != null ) {
                  this.imagePreviewLink = data['image'];
                }

                if(data['candidate'] && data['candidate'].base_country)
                {
                  this.info.base_country = data['candidate'].base_country;
                }
                if(data['candidate'] && data['candidate'].base_city){
                  this.info.city = data['candidate'].base_city;
                }


              }
              this.why_work=data['candidate'].why_work;
              if(data['candidate'] && data['candidate'].blockchain)
              {
                if(data['candidate'].blockchain.commercial_skills )
                {
                  this.commercialSkillsExperienceYear = data['candidate'].blockchain.commercial_skills;
                  for (let key of data['candidate'].blockchain.commercial_skills)
                  {
                    for(var i in key)
                    {

                      for(let option of this.otherSkills)
                      {

                        if(option.value === key[i])
                        {
                          option.checked=true;
                          this.skillDbArray.push(key[i]);
                          this.skillDb= ({value: key[i]});
                          this.commercialSkills.push(this.skillDb);

                        }
                        else
                        {

                        }

                      }

                      for(let option of this.exp_year)
                      {

                        if(option.value === key[i])
                        {
                          option.checked=true;
                          this.skill_expYear_db.push(key[i]);

                        }

                      }

                    }
                  }
                }

                if(data['candidate'].blockchain.description_commercial_skills)
                {
                  this.description_commercial_skills = data['candidate'].blockchain.description_commercial_skills;
                }

                if(data['candidate'].blockchain.commercial_platforms)
                {
                  this.commercial_expYear = data['candidate'].blockchain.commercial_platforms;
                  for (let key of data['candidate'].blockchain.commercial_platforms)
                  {
                    for(var i in key)
                    {


                      for(let option of this.commercially)
                      {

                        if(option.value == key[i])
                        {
                          option.checked=true;
                          this.db_valye.push(key[i]);
                          this.db_lang= ({value: key[i]});
                          this.commercially_worked.push(this.db_lang);

                        }
                        else
                        {

                        }

                      }

                      for(let option of this.exp_year)
                      {

                        if(option.value == key[i])
                        {
                          option.checked=true;
                          this.expYear_db.push(key[i]);

                        }

                      }

                    }
                  }

                }

                if(data['candidate'].blockchain.description_commercial_platforms)
                {
                  this.description_commercial_platforms = data['candidate'].blockchain.description_commercial_platforms;
                }

                if(data['candidate'].blockchain.experimented_platforms)
                {
                  for (let plat of data['candidate'].blockchain.experimented_platforms)
                  {

                    for(let option of this.experimented)
                    {

                      if(option.value === plat)
                      {
                        option.checked=true;
                        this.experimented_platform.push(plat);

                      }

                    }

                  }
                }

                if(data['candidate'].blockchain.description_experimented_platforms)
                {
                  this.description_experimented_platforms = data['candidate'].blockchain.description_experimented_platforms;
                }
              }


              if(data['candidate'].current_currency ){
                this.current_currency =data['candidate'].current_currency;
              }
              if(data['candidate'].current_salary) {
                this.current_salary = data['candidate'].current_salary;
              }
              this.Intro =data['candidate'].description;
              if(data['candidate'].programming_languages && data['candidate'].programming_languages.length > 0)
              {
                this.LangexpYear = data['candidate'].programming_languages;
                for (let key of data['candidate'].programming_languages)
                {
                  for(var i in key)
                  {


                    for(let option of this.language_opt)
                    {

                      if(option.value == key[i])
                      {
                        option.checked=true;
                        this.lang_db_valye.push(key[i]);
                        this.db_lang= ({value: key[i]});
                        this.language.push(this.db_lang);
                      }
                      else
                      {

                      }

                    }

                    for(let option of this.exp_year)
                    {

                      if(option.value == key[i])
                      {
                        option.checked=true;
                        this.lang_expYear_db.push(key[i]);

                      }

                    }

                  }
                }
              }
              if(data['candidate'].work_history) {
                this.jobData = data['candidate'].work_history;

                for(let data1 of data['candidate'].work_history)
                {
                  this.current_work_check.push(data1.currentwork);

                }

                this.ExperienceForm = this._fb.group({
                  ExpItems: this._fb.array(
                    this.history_data()
                  )
                });
              }

              if(data['candidate'].education_history)
              {

                this.eduData = data['candidate'].education_history;
                this.EducationForm = this._fb.group({
                  itemRows: this._fb.array(
                    this.education_data()
                  )
                });
                if (isPlatformBrowser(this.platformId)) {
                  setTimeout(() => {
                    $('.selectpicker').selectpicker();
                  }, 300);

                  setTimeout(() => {
                    $('.selectpicker').selectpicker('refresh');
                  }, 900);
                }
              }
            }

            if (isPlatformBrowser(this.platformId)) {
              setTimeout(() => {
                $('.selectpicker').selectpicker('refresh');
              }, 300);
            }

          },
          error =>
          {
            if(error.message === 500 || error.message === 401)
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

  ngAfterViewInit(): void
  {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        $('.selectpicker').selectpicker();
      }, 300);

      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh');
      }, 900);
    }
  }

  currency = constants.currencies;
  experience = constants.experienceYears;
  dropdown_options = constants.workRoles;
  area_interested = constants.workBlockchainInterests;
  graduation_year = constants.year;
  year = constants.year;
  availability = constants.workAvailability;
  commercially = constants.blockchainPlatforms;
  experimented = constants.experimented;
  exp_year = constants.experienceYears;

  onExpOptions(e)
  {

    if(e.target.checked)
    {
      this.experimented_platform.push(e.target.value);
    }
    else{
      let updateItem = this.experimented_platform.find(this.findIndexToUpdateExperimented, e.target.value);

      let index = this.experimented_platform.indexOf(updateItem);

      this.experimented_platform.splice(index, 1);
    }

  }

  findIndexToUpdateExperimented(type) {
    return type == this;
  }

  oncommerciallyOptions(obj)
  {

    let updateItem = this.commercially_worked.find(this.findIndexToUpdate_funct, obj.value);
    let index = this.commercially_worked.indexOf(updateItem);
    if(index > -1)
    {
      this.commercially_worked.splice(index, 1);
      let updateItem2 = this.findObjectByKey(this.commercial_expYear, 'name', obj.value);
      let index2 = this.commercial_expYear.indexOf(updateItem2);

      if(index2 > -1)
      {

        this.commercial_expYear.splice(index2, 1);
      }
    }
    else
    {
      obj.checked =true;
      this.commercially_worked.push(obj);
    }

  }

  onComExpYearOptions(e, value)
  {


    let updateItem = this.findObjectByKey(this.commercial_expYear, 'name', value);

    let index = this.commercial_expYear.indexOf(updateItem);

    if(index > -1)
    {

      this.commercial_expYear.splice(index, 1);
      this.value=value;
      this.referringData = { name :this.value, exp_year: e.target.value};
      this.commercial_expYear.push(this.referringData);

    }
    else
    {
      this.value=value;
      this.referringData = { name :this.value, exp_year: e.target.value};
      this.commercial_expYear.push(this.referringData);

    }
    this.commercial_expYear.sort(function(a, b){
      if(a.name < b.name) { return -1; }
      if(a.name > b.name) { return 1; }
      return 0;
    });
  }

  findObjectByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        return array[i];
      }

    }
    return null;
  }


  calen_month = constants.calen_month;
  language_opt = constants.programmingLanguages;

  onLangExpOptions(obj)
  {
    let updateItem = this.language.find(this.findIndexToUpdate_funct, obj.value);
    let index = this.language.indexOf(updateItem);
    if(index > -1)
    {
      this.language.splice(index, 1);
      let updateItem2 = this.findObjectByKey(this.LangexpYear, 'language', obj.value);
      let index2 = this.LangexpYear.indexOf(updateItem2);

      if(index2 > -1)
      {

        this.LangexpYear.splice(index2, 1);
      }
    }
    else
    {
      obj.checked =true;
      this.language.push(obj);
    }
    this.LangexpYear.sort(function(a, b){
      if(a.language < b.language) { return -1; }
      if(a.language > b.language) { return 1; }
      return 0;
    })

  }


  findIndexToUpdate(obj)
  {
    return obj.value === this;
  }

  findIndexToUpdate_funct(obj)
  {
    return obj.value === this;
  }

  initItemRows()
  {
    return this._fb.group({
      uniname: [''],
      degreename:[''],
      fieldname:[''],
      eduyear:[]
    });

  }

  initExpRows()
  {
    return this._fb.group({
      companyname:[''],
      positionname:[''],
      locationname: [''],
      description: [''] ,
      startdate:[],
      startyear:[],
      end_date:[],
      endyear:[],
      start_date:[],
      enddate:[],
      currentwork:[false],

    });
  }

  currentWork(){
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        $('.selectpicker').selectpicker();
        $('.selectpicker').selectpicker('refresh');
      }, 200);
    }
  }
  addNewExpRow()
  {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        $('.selectpicker').selectpicker();
        $('.selectpicker').selectpicker('refresh');
      }, 200);
    }
    // control refers to your formarray
    const control = <FormArray>this.ExperienceForm.controls['ExpItems'];
    // add new formgroup
    control.push(this.initExpRows());
  }

  deleteExpRow(index: number)
  {
    // control refers to your formarray
    const control = <FormArray>this.ExperienceForm.controls['ExpItems'];
    // remove the chosen row
    control.removeAt(index);
  }

  get DynamicWorkFormControls()
  {

    return <FormArray>this.ExperienceForm.get('ExpItems');
  }
  addNewRow()
  {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        $('.selectpicker').selectpicker();
        $('.selectpicker').selectpicker('refresh');
      }, 100);
    }
    // control refers to your formarray
    //this.EducationForm.value.itemRows = "";
    const control = <FormArray>this.EducationForm.controls['itemRows'];
    // add new formgroup
    control.push(this.initItemRows());
  }


  deleteRow(index: number)
  {

    // control refers to your formarray
    const control = <FormArray>this.EducationForm.controls['itemRows'];
    // remove the chosen row
    control.removeAt(index);
  }

  get DynamicEduFormControls() {

    return <FormArray>this.EducationForm.get('itemRows');
  }

  onLangExpYearOptions(e, value)
  {

    let updateItem = this.findObjectByKey(this.LangexpYear, 'language', value);
    let index = this.LangexpYear.indexOf(updateItem);

    if(index > -1)
    {

      this.LangexpYear.splice(index, 1);
      this.value=value;
      this.referringData = { language:this.value, exp_year: e.target.value};
      this.LangexpYear.push(this.referringData);
    }
    else
    {
      this.value=value;
      this.referringData = { language:this.value, exp_year: e.target.value};
      this.LangexpYear.push(this.referringData);

    }


  }

  work_start_data(e)
  {
    this.start_month = e.target.value ;
  }
  work_start_year(e)
  {
    this.start_year= e.target.value;
  }

  ////////////////////////save edit profile data//////////////////////////////////
  start_monthh;
  experiencearray=[];
  experiencejson;
  monthNameToNum(monthname) {
    this.start_monthh = this.calen_month.indexOf(monthname);
    this.start_monthh = "0"  + (this.start_monthh);
    return this.start_monthh ?  this.start_monthh : 0;
  }

  commercial_desc_log;
  experimented_desc_log;
  commercialSkills_desc_log;

  candidate_profile(profileForm: NgForm)
  {
    this.error_msg = "";
    this.count = 0;
    this.submit = "click";
    this.validatedLocation = [];
    let flag_commercial_desc = true;
    let flag_experimented_desc = true;
    let flag_commercialSkills_desc = true;
    this.display_error = '';
    this.remote_location_log = '';

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let employeeCount = 0;
    let contractorCount = 0;
    let volunteerCount = 0;
    let inputQuery: any = {};
    let remote_error_count = 0;
    let visaRequired = 0;

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
      if(!this.employee.currency) {
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
      if(!this.contractor.currency) {
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

    if(this.current_salary && !this.current_currency ) {
      this.current_currency_log = "Please choose currency";
      this.count++;
    }

    if(this.current_salary && this.current_currency === "-1" ) {
      this.current_currency_log = "Please choose currency";
      this.count++;
    }

    if(!this.current_salary && this.current_currency !== "-1") {
      this.current_sal_log = "Please enter current base salary";
      this.count++;
    }

    if((!this.current_salary && !this.current_currency) || (!this.current_salary && this.current_currency === "-1")){
      this.count = 0;
    }

    if(this.selectedValue.length<=0)
    {
      this.interest_log = "Please select at least one area of interest";
    }

    if(!this.info.first_name)
    {
      this.first_name_log="Please enter first name";

    }
    if(!this.info.last_name)
    {
      this.last_name_log="Please enter last name";

    }
    if(!this.info.contact_number)
    {
      this.contact_name_log ="Please enter contact number";
    }

    if(!this.info.nationality || (this.info.nationality && this.info.nationality.length === 0) )
    {
      this.nationality_log ="Please choose nationality";
      this.count++;
    }
    if(this.info.nationality && this.info.nationality.length > 4) {
      this.nationality_log = "Please select maximum 4 nationalities";
      this.count++;
    }

    if(!this.info.base_country )
    {
      this.base_country_log ="Please choose base country";
    }

    if(!this.info.city)
    {
      this.city_log ="Please enter base city";
    }

    if(!this.why_work)
    {
      this.why_work_log = "Please fill why do you want to work on blockchain?";
    }

    if(this.commercially_worked.length !== this.commercial_expYear.length )
    {
      this.commercial_log = "Please fill year of experience";
    }

    if(this.commercially_worked.length > 0 && !this.description_commercial_platforms){
      flag_commercial_desc = false;
      this.commercial_desc_log = 'Please enter description of commercial experience';
    }

    if(this.experimented_platform.length > 0 && !this.description_experimented_platforms){
      flag_experimented_desc = false;
      this.experimented_desc_log = 'Please enter description of experimented with';
    }

    if(this.LangexpYear.length !==  this.language.length)
    {

      this.exp_lang_log="Please fill year of experience";
    }
    if(!this.Intro)
    {

      this.intro_log="Please fill 2-5 sentence bio"
    }

    if(this.commercialSkills.length !== this.commercialSkillsExperienceYear.length)
    {
      this.commercial_skill_log = "Please fill year of experience";
    }

    if(this.commercialSkills.length > 0 && !this.description_commercial_skills){
      flag_commercialSkills_desc = false;
      this.commercialSkills_desc_log = 'Please enter description of commercial experience';
    }

    if(this.EducationForm.value.itemRows.length >= 1)
    {

      for (var key in this.EducationForm.value.itemRows)
      {
        if(!this.EducationForm.value.itemRows[key].uniname)
        {
          this.uni_name_log = "Please fill university";
        }

        if(!this.EducationForm.value.itemRows[key].degreename)
        {
          this.degree_log = "Please fill degree";
        }

        if(!this.EducationForm.value.itemRows[key].fieldname)
        {
          this.field_log = "Please fill field of study";
        }

        if(!this.EducationForm.value.itemRows[key].eduyear)
        {
          this.eduYear_log = "Please fill graduation year";
        }



        if(this.EducationForm.value.itemRows[key].uniname && this.EducationForm.value.itemRows[key].degreename &&
          this.EducationForm.value.itemRows[key].fieldname && this.EducationForm.value.itemRows[key].eduyear)
        {

          this.edu_count = parseInt(key) + 1;
        }

      }

    }
    if(this.ExperienceForm.value.ExpItems.length >=1)
    {
      this.exp_count =0;
      for (var key in this.ExperienceForm.value.ExpItems)
      {
        this.startmonthIndex = this.monthNameToNum(this.ExperienceForm.value.ExpItems[key].start_date);
        this.endmonthIndex = this.monthNameToNum(this.ExperienceForm.value.ExpItems[key].end_date);
        this.start_date_format  = new Date(this.ExperienceForm.value.ExpItems[key].startyear, this.startmonthIndex);
        if(this.ExperienceForm.value.ExpItems[key].currentwork === true)
        {
          this.end_date_format = Date.now();
        }
        else
        {
          this.end_date_format = new Date(this.ExperienceForm.value.ExpItems[key].endyear, this.endmonthIndex);

        }
        if(!this.ExperienceForm.value.ExpItems[key].companyname)
        {
          this.company_log = "Please fill company";
        }

        if(!this.ExperienceForm.value.ExpItems[key].positionname)
        {
          this.position_log = "Please fill position";
        }


        if(!this.ExperienceForm.value.ExpItems[key].locationname)
        {
          this.location_log = "Please fill location";

        }

        if(!this.ExperienceForm.value.ExpItems[key].startdate )
        {
          this.start_date_log = "Please fill month";
        }

        if( !this.ExperienceForm.value.ExpItems[key].startyear)
        {
          this.start_date_year_log = "Please fill year";
        }

        if(!this.ExperienceForm.value.ExpItems[key].end_date && this.ExperienceForm.value.ExpItems[key].currentwork === false)
        {
          this.end_date_log = "Please fill month";
        }

        if(!this.ExperienceForm.value.ExpItems[key].endyear && this.ExperienceForm.value.ExpItems[key].currentwork === false)
        {
          this.end_date_year_log = "Please fill year ";
        }

        if(this.ExperienceForm.value.ExpItems[key].companyname && this.ExperienceForm.value.ExpItems[key].positionname &&
          this.ExperienceForm.value.ExpItems[key].locationname && this.ExperienceForm.value.ExpItems[key].start_date &&
          this.ExperienceForm.value.ExpItems[key].startyear && this.ExperienceForm.value.ExpItems[key].end_date &&
          this.ExperienceForm.value.ExpItems[key].endyear && this.ExperienceForm.value.ExpItems[key].currentwork==false)
        {

          let verified=0;
          if(this.compareDates(this.ExperienceForm.value.ExpItems[key].start_date , this.ExperienceForm.value.ExpItems[key].startyear,this.ExperienceForm.value.ExpItems[key].end_date , this.ExperienceForm.value.ExpItems[key].endyear , this.ExperienceForm.value.ExpItems[key].currentwork)) {
            this.dateValidation = 'Date must be greater than previous date';
            verified=1;
          }

          if(this.checkDateVerification(this.ExperienceForm.value.ExpItems[key].end_date , this.ExperienceForm.value.ExpItems[key].endyear)) {
            verified=1;
          }
          if(this.checkDateVerification(this.ExperienceForm.value.ExpItems[key].start_date , this.ExperienceForm.value.ExpItems[key].startyear)) {
            verified=1;
          }
          if(verified === 0) {
            this.exp_count = this.exp_count + 1;
          }

        }


        if(this.ExperienceForm.value.ExpItems[key].companyname && this.ExperienceForm.value.ExpItems[key].positionname &&
          this.ExperienceForm.value.ExpItems[key].locationname && this.ExperienceForm.value.ExpItems[key].start_date &&
          this.ExperienceForm.value.ExpItems[key].startyear &&  this.ExperienceForm.value.ExpItems[key].currentwork==true)
        {
          let dverified=0;
          if(this.checkDateVerification(this.ExperienceForm.value.ExpItems[key].start_date , this.ExperienceForm.value.ExpItems[key].startyear)) {
            dverified=1;
          }
          if(dverified === 0) {
            this.exp_count = parseInt(key) + 1;
          }

          this.ExperienceForm.value.ExpItems[key].enddate = new Date();

        }

      }

    }

    if(remote_error_count === 0 && this.count === 0 && (this.employeeCheck || this.contractorCheck || this.volunteerCheck)
      && employeeCount === 0 && contractorCount === 0 && volunteerCount === 0 && this.info.first_name && this.info.last_name && this.info.contact_number && this.info.nationality &&
      this.info.city && this.info.base_country && this.selectedValue.length > 0 &&
      this.why_work && this.commercially_worked.length === this.commercial_expYear.length &&
      this.language &&this.LangexpYear.length ===  this.language.length && this.Intro && this.edu_count === this.EducationForm.value.itemRows.length && this.exp_count === this.ExperienceForm.value.ExpItems.length
      && this.commercialSkills.length === this.commercialSkillsExperienceYear.length
      && flag_commercial_desc && flag_experimented_desc && flag_commercialSkills_desc
    )
    {
      this.verify = true;
    }
    else {
      this.verify = false;
    }
    if(this.verify === true ) {
      if(typeof(this.expected_salaryyy) === 'string' )
        profileForm.value.expected_salary = parseInt(this.expected_salaryyy);
      if(this.salary && typeof (this.salary) === 'string') {
        profileForm.value.salary = parseInt(this.salary);

      }

      this.updateProfileData(profileForm.value);
    }
    else {
      this.error_msg = "One or more fields need to be completed. Please scroll up to see which ones.";
    }

  }


  file_size=1048576;
  image_log;
  imageName;
  updateProfileData(profileForm)
  {
    profileForm.selectedlocations = this.validatedLocation;
    this.experiencearray=[];
    this.education_json_array=[];
    if(this.imageCropData.image) {
      const file = this.dataURLtoFile(this.imageCropData.image, this.imageName);
      const formData = new FormData();
      formData.append('image', file);
      this.authenticationService.edit_candidate_profile(this.user_id ,formData , true)
        .subscribe(
          data => {
            if (data) {

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
    for (var key in this.ExperienceForm.value.ExpItems)
    {
      this.startmonthIndex = this.monthNameToNum(this.ExperienceForm.value.ExpItems[key].start_date);
      this.endmonthIndex = this.monthNameToNum(this.ExperienceForm.value.ExpItems[key].end_date);
      this.start_date_format  = new Date(this.ExperienceForm.value.ExpItems[key].startyear, this.startmonthIndex);
      this.end_date_format = new Date(this.ExperienceForm.value.ExpItems[key].endyear, this.endmonthIndex);
      if(this.ExperienceForm.value.ExpItems[key].currentwork == true )
      {
        this.end_date_format = new Date();
      }
      this.experiencejson = {companyname : this.ExperienceForm.value.ExpItems[key].companyname , positionname : this.ExperienceForm.value.ExpItems[key].positionname,locationname : this.ExperienceForm.value.ExpItems[key].locationname,description : this.ExperienceForm.value.ExpItems[key].description,startdate : this.start_date_format,enddate : this.end_date_format , currentwork : this.ExperienceForm.value.ExpItems[key].currentwork};
      this.experiencearray.push(this.experiencejson);
    }

    for ( var key in this.EducationForm.value.itemRows)
    {
      this.EducationForm.value.itemRows[key].eduyear =  parseInt(this.EducationForm.value.itemRows[key].eduyear);
      this.educationjson = {uniname : this.EducationForm.value.itemRows[key].uniname , degreename :  this.EducationForm.value.itemRows[key].degreename
        ,fieldname : this.EducationForm.value.itemRows[key].fieldname , eduyear : this.EducationForm.value.itemRows[key].eduyear  };
      this.education_json_array.push(this.educationjson) ;
    }

    if(this.commercially_worked.length === 0) {
      profileForm.unset_commercial_platforms = true;
      profileForm.commercial_platforms = [];
    }
    else {
      profileForm.commercial_platforms = this.commercial_expYear;
    }

    if(this.commercialSkills.length === 0) {
      profileForm.unset_commercial_skills = true;
      profileForm.commercial_skills = [];
    }
    else {
      profileForm.commercial_skills = this.commercialSkillsExperienceYear;
    }

    profileForm.description_commercial_platforms = '';
    if(this.description_commercial_platforms){
      profileForm.description_commercial_platforms = this.description_commercial_platforms;
    }

    profileForm.description_experimented_platforms = '';
    if(this.description_experimented_platforms){
      profileForm.description_experimented_platforms = this.description_experimented_platforms;
    }

    profileForm.description_commercial_skills = '';
    if(this.description_commercial_skills){
      profileForm.description_commercial_skills = this.description_commercial_skills;
    }

    if(this.language.length === 0) {
      profileForm.unset_language = true;
      profileForm.language = [];
    }
    else {
      profileForm.language_experience_year = this.LangexpYear;
    }

    if(this.jobselected){
      profileForm.roles = this.jobselected;
    }

    if(this.selectedValue){
      profileForm.interest_area = this.selectedValue;
    }

    let inputQuery:any ={};

    if(this.info.first_name) inputQuery.first_name = this.info.first_name;
    if(this.info.last_name) inputQuery.last_name = this.info.last_name;
    if(this.info.contact_number && this.info.country_code) inputQuery.contact_number = this.info.country_code +' '+this.info.contact_number;

    if(this.info.github_account) inputQuery.github_account = this.info.github_account;
    else inputQuery.unset_github_account = true;


    if(this.info.exchange_account) inputQuery.exchange_account = this.info.exchange_account;
    else inputQuery.unset_exchange_account = true;


    if(this.info.linkedin_account) inputQuery.linkedin_account = this.info.linkedin_account;
    else inputQuery.unset_linkedin_account = true;


    if(this.info.medium_account) inputQuery.medium_account = this.info.medium_account;
    else inputQuery.unset_medium_account = true;

    if(this.info.stackoverflow_url) inputQuery.stackoverflow_url = this.info.stackoverflow_url;
    else inputQuery.unset_stackoverflow_url= true;

    if(this.info.personal_website_url) inputQuery.personal_website_url = this.info.personal_website_url;
    else inputQuery.unset_personal_website_url = true;

    if(this.current_currency && this.current_currency !== '-1') inputQuery.current_currency = this.current_currency;
    else inputQuery.unset_curret_currency = true;
    if(this.salary) inputQuery.current_salary = this.salary;

    if(this.info.nationality) inputQuery.nationality = this.info.nationality;
    if(this.Intro) inputQuery.description = this.Intro;
    if(this.info.base_country) inputQuery.base_country = this.info.base_country;
    if(this.info.city) inputQuery.base_city = this.info.city;
    if(this.validatedLocation) inputQuery.locations = this.validatedLocation;
    if(this.jobselected) inputQuery.roles = this.jobselected;
    if(this.expected_salaryyy) inputQuery.expected_salary = this.expected_salaryyy;
    if(this.base_currency) inputQuery.expected_salary_currency = this.base_currency;
    if(this.selectedValue) inputQuery.interest_areas = this.selectedValue;
    if(this.availability_day) inputQuery.availability_day = this.availability_day;
    if(this.why_work) inputQuery.why_work = this.why_work;
    if(profileForm.commercial_platforms) inputQuery.commercial_platforms = profileForm.commercial_platforms;
    if(profileForm.description_commercial_platforms) inputQuery.description_commercial_platforms = profileForm.description_commercial_platforms;
    if(this.experimented_platform) inputQuery.experimented_platforms = this.experimented_platform;
    if(profileForm.description_experimented_platforms) inputQuery.description_experimented_platforms = profileForm.description_experimented_platforms;
    if(profileForm.commercial_skills) inputQuery.commercial_skills = profileForm.commercial_skills;
    if(profileForm.description_commercial_skills) inputQuery.description_commercial_skills = profileForm.description_commercial_skills;
    if(profileForm.language_experience_year) inputQuery.programming_languages = profileForm.language_experience_year;
    if(this.education_json_array) inputQuery.education_history = this.education_json_array;
    if(this.experiencearray) inputQuery.work_history = this.experiencearray;
    if(this.employeeCheck) {
      inputQuery.employee = {
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
      inputQuery.contractor = {
        expected_hourly_rate : parseInt(this.contractor.hourly_rate),
        currency: this.contractor.currency,
        location: this.contractor.locations,
        roles: this.contractor.roles,
        contractor_type: this.contractor.contractor_type,
        service_description : this.contractor.service_description
      }
      if(this.checkContractValue(this.contractor.contractor_type) && this.contractor.agency_website) inputQuery.contractor.agency_website = this.contractor.agency_website;
      if(this.contractor.max_hour_per_week && this.contractor.max_hour_per_week !== '-1') inputQuery.contractor.max_hour_per_week = parseInt(this.contractor.max_hour_per_week);
    }
    else inputQuery.unset_contractor = true;

    if(this.volunteerCheck) {
      inputQuery.volunteer = {
        location: this.volunteer.locations,
        roles: this.volunteer.roles,
        learning_objectives : this.volunteer.learning_objectives
      }
      if(this.volunteer.max_hours_per_week && this.volunteer.max_hours_per_week !== '-1') {
        inputQuery.volunteer.max_hours_per_week = parseInt(this.volunteer.max_hours_per_week);
      }
    }
    else inputQuery.unset_volunteer = true;

    if(this.current_salary) inputQuery.current_salary = parseInt(this.current_salary);
    if(this.current_currency) inputQuery.current_currency = this.current_currency;
    if(this.selectedValue.length > 0) inputQuery.interest_areas = this.selectedValue;

    inputQuery.unset_commercial_platforms = profileForm.unset_commercial_platforms;
    inputQuery.unset_commercial_skills = profileForm.unset_commercial_skills;

    if(this.experimented_platform.length == 0) inputQuery.unset_experimented_platforms = true;

    inputQuery.unset_language = profileForm.unset_language;

    if(this.education_json_array.length === 0) inputQuery.unset_education_history = true;

    if(this.experiencearray.length === 0) inputQuery.unset_work_history = true;

    this.authenticationService.edit_candidate_profile(this.user_id, inputQuery , true)
      .subscribe(
        data => {
          if(data && this.currentUser)
          {
            this.router.navigate(['/admin-candidate-detail'], { queryParams: { user: this.user_id } });

          }

        },
        error => {
          this.dataservice.changeMessage(error);
          this.log = 'Something went wrong';
          if(error.message === 500)
          {
            localStorage.setItem('jwt_not_found', 'Jwt token not found');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('googleUser');
            localStorage.removeItem('close_notify');
            localStorage.removeItem('linkedinUser');
            localStorage.removeItem('admin_log');
            window.location.href = '/login';
          }

        });


  }

  commercialSkills=[];
  commercialSkillsExperienceYear=[];

  oncommercialSkillsOptions(obj)
  {

    let updateItem = this.commercialSkills.find(this.findIndexToUpdate_funct, obj.value);
    let index = this.commercialSkills.indexOf(updateItem);
    if(index > -1)
    {
      this.commercialSkills.splice(index, 1);
      let updateItem2 = this.findObjectByKey(this.commercialSkillsExperienceYear, 'skill',  obj.value);
      let index2 = this.commercialSkillsExperienceYear.indexOf(updateItem2);

      if(index2 > -1)
      {

        this.commercialSkillsExperienceYear.splice(index2, 1);
      }
    }
    else
    {
      obj.checked =true;
      this.commercialSkills.push(obj);
    }


  }

  onComSkillExpYearOptions(e, value)
  {
    let updateItem = this.findObjectByKey(this.commercialSkillsExperienceYear, 'skill', value);
    let index = this.commercialSkillsExperienceYear.indexOf(updateItem);

    if(index > -1)
    {

      this.commercialSkillsExperienceYear.splice(index, 1);
      this.value = value;
      this.referringData = { skill : this.value, exp_year: e.target.value};
      this.commercialSkillsExperienceYear.push(this.referringData);

    }
    else
    {
      this.value=value;
      this.referringData = { skill : this.value, exp_year: e.target.value};
      this.commercialSkillsExperienceYear.push(this.referringData);

    }
    this.commercialSkillsExperienceYear.sort(function(a, b){
      if(a.skill < b.skill) { return -1; }
      if(a.skill > b.skill) { return 1; }
      return 0;
    })
  }

  verify;
  dateValidation;
  checkDateVerification(month,year) {
    if(month && year) {
      this.startmonthIndex = this.monthNameToNum(month);
      this.start_date_format  = new Date(year, this.startmonthIndex);
      if(this.start_date_format > new Date()) {
        this.verify= false;
        return true;
      }
      else {
        this.verify= true;
        return false;
      }
    }
    else {
      return false;
    }
  }

  compareDates(startmonth , startyear , endmonth, endyear, current) {
    let startMonth = this.monthNameToNum(startmonth);
    let startDateFormat  = new Date(startyear, startMonth);

    let endMonth = this.monthNameToNum(endmonth);
    let endDateFormat  = new Date(endyear, endMonth);

    if(current  === true) {
      return false;
    }
    else {
      if(startDateFormat > endDateFormat && this.submit === 'click') {
        this.dateValidation = 'Date must be greater than previous date';
        this.verify = false;
        return true;
      }
      else {
        this.verify = true;
        return false;
      }
    }
  }

  endDateYear() {
    this.dateValidation = "";
  }

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

  checkValidation(value) {
    if(value.filter(i => i.visa_needed === true).length === value.length) return true;
    else return false;
  }

  checkContractValue(array) {
    if(array && array.indexOf('agency') > -1) return true;
    else return false;
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
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh');
      }, 300);
    }
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

  onAreaSelected(e)
  {
    if(e.target.checked) {
      this.selectedValue.push(e.target.value);
    }
    else{
      let updateItem = this.selectedValue.find(x => x === e.target.value);
      let index = this.selectedValue.indexOf(updateItem);
      this.selectedValue.splice(index, 1);
    }
  }

  fileChangeListener($event) {
    var image:any = new Image();
    var file:File = $event.target.files[0];
    var myReader:FileReader = new FileReader();
    var that = this;
    myReader.onloadend = function (loadEvent:any) {
      image.src = loadEvent.target.result;
      that.cropper.setImage(image);
    };
    this.imageName = file.name;
    myReader.readAsDataURL(file);
  }


  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, {type:mime});
  }

  imageCropped(key) {
    if(key === 'cancel') {
      this.imageCropData = {};
    }
    if (isPlatformBrowser(this.platformId)) $('#imageModal').modal('hide');
  }

}
