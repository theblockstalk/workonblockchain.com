import { Component, OnInit,ViewChild ,AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import {UserService} from '../../user.service';
import {NgForm, FormGroup, FormBuilder} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {PagerService} from '../../pager.service';
import {constants} from '../../../constants/constants';
import {makeImgCode, makeIconCode,isEmpty } from '../../../services/object';
import {isPlatformBrowser} from "@angular/common";
declare var $:any;

@Component({
  selector: 'app-company-search',
  templateUrl: './company-search.component.html',
  styleUrls: ['./company-search.component.css']
})
export class CompanySearchComponent implements OnInit,AfterViewInit {
  currentUser: any;
  preferncesForm: FormGroup;
  log;
  info = [];
  length;
  page;
  searchWord;
  employee: any = {};
  contractor: any = {};
  volunteer: any = {};
  job_title;
  public value;
  public current: string;
  msg;
  is_approved;
  first_name;
  last_name;
  company_name;
  company_website;
  company_phone;
  company_country;
  company_city;
  company_postcode;
  company_description;
  company_founded;
  company_funded;
  no_of_employees;
  display_name;
  interview_location = '';
  disabled;
  ckeConfig: any;
  @ViewChild("myckeditor") ckeditor: any;
  job_offer_log;
  saved_searches;
  skill_value = '';
  location;
  role_value;
  pager: any = {};
  pagedItems: any[];
  countries;
  selectedValueArray = [];
  countriesModel;
  error;
  cities;
  emptyInput;
  errorMsg;
  urlParameters : any = {};
  no_value = false;
  saveSearchName;
  skill;
  searchName = [];
  savedSearches;
  model: any = {};
    expected_hourly_rate;
  salary;
  currencyChange;
  information;
  not_found;
  visa_check;
  workTypes = constants.workTypes;
  hourly_rate;
  contractorCurrency;
  success_msg;
  error_msg;
  _id;
  timestamp;
  pref_job_type;
  other_technologies;
  response;
  count;
  candidate_data;
  verify_msg;
  responseMsg;
  programming_languages;
  user_id;
  user_name;
  date_of_joining;
  msg_tag;
  is_company_reply = 0;
  msg_body;
  description;
  job_title_log;
  location_log;
  salary_log;
  salary_currency_log;
  employment_log;
  job_desc_log;
  job_offer_log_success;
  job_offer_log_erorr;
  newSearchLocation = [];
  selectedWorkType;
  searchData;
  commercialSkillsFromDB;selectedCommercialSkillsNew;
  newSkillsSelected = [];
  //new
  controllerOptions: any = {};yearsErrMsg;
  autoSuggestController;
  resultItemDisplay;object;selectedText;selectedSkillExpYear=[];
  years_exp_min_new = constants.years_exp_min_new;

  constructor(private _fb: FormBuilder, private pagerService: PagerService, private authenticationService: UserService, private route: ActivatedRoute, private router: Router,@Inject(PLATFORM_ID) private platformId: Object) {
    this.route.queryParams.subscribe(params => {
      if (params['queryBody']) {
        this.urlParameters = JSON.parse(params['queryBody']);
        if (this.urlParameters) {
          this.no_value = true;
          if (this.urlParameters.work_type) {
            for (let option of this.workTypes) {
              if (option.value === this.urlParameters.work_type) {
                option.checked = true;
                this.selectedWorkType = option.value;
              }
            }
          }
          if (this.urlParameters.searchName) {
            this.saveSearchName = this.urlParameters.searchName;
          }

          if (this.urlParameters.locations) {
            this.selectedValueArray = this.urlParameters.locations;
          }
          if (this.urlParameters.visa_needed) {
            this.visa_check = this.urlParameters.visa_needed;
          }
          if (this.urlParameters.roles) {
            this.role_value = this.urlParameters.roles;
          }
          if (this.urlParameters.current_salary && this.urlParameters.current_currency) {
            this.salary = this.urlParameters.current_salary;
            this.currencyChange = this.urlParameters.current_currency;
          }
          if (this.urlParameters.expected_hourly_rate && this.urlParameters.currency) {
            this.hourly_rate = this.urlParameters.expected_hourly_rate;
            this.contractorCurrency = this.urlParameters.currency;
          }
          if (this.urlParameters.required_skills && this.urlParameters.required_skills.length > 0) {
            this.commercialSkillsFromDB = this.urlParameters.required_skills;
            this.selectedCommercialSkillsNew = this.urlParameters.required_skills;
            this.selectedSkillExpYear = this.urlParameters.required_skills;
          }
          this.searchdata("urlQuery", this.urlParameters);
        }
      }

    });

  }

  currency = constants.currencies;
  job_type = constants.job_type;
  rolesData = constants.workRoles;

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

  ngOnInit() {
    //new code
    this.controllerOptions = true;
    this.autoSuggestController = function (textValue, controllerOptions) {
      this.selectedText = textValue;
      return this.authenticationService.autoSuggestSkills(textValue);
    };

    this.resultItemDisplay = function (data) {
      const skillsInput = data;
      let skillsOptions = [];
      for(let skill of skillsInput['skills']) {
        let obj = {};
        if(this.selectedText === 'C' || this.selectedText === 'c') {
          console.log('in if');
          if(skill['skill'].type === 'language') {
            obj = {
              _id: skill['skill']._id,
              name: skill['skill'].name,
              type: skill['skill'].type,
              img: makeIconCode('fas fa-code')
            };
          }
        }
        else {
          console.log('in else');
          obj = {
            _id: skill['skill']._id,
            name: skill['skill'].name,
            type: skill['skill'].type
          };
          if(skill['skill'].type === 'blockchain')
            obj['img'] = makeImgCode(skill['skill']);
          if(skill['skill'].type === 'language')
            obj['img'] = makeIconCode('fas fa-code');
          if(skill['skill'].type === 'experience')
            obj['img'] = makeIconCode('fas fa-user-friends');
        }
        if(!isEmpty(obj))
          skillsOptions.push(obj);
      }
      return skillsOptions;
    }
    //new code ends

    this.newSkillsSelected = [];

    this.success_msg = '';
    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true,
      height: '10rem',
      removePlugins: 'resize,elementspath',
      removeButtons: 'Cut,Copy,Paste,Undo,Redo,Anchor,Bold,Italic,Underline,Subscript,Superscript,Source,Save,Preview,Print,Templates,Find,Replace,SelectAll,NewPage,PasteFromWord,Form,Checkbox,Radio,TextField,Textarea,Button,ImageButton,HiddenField,RemoveFormat,TextColor,Maximize,ShowBlocks,About,Font,FontSize,Link,Unlink,Image,Flash,Table,Smiley,Iframe,Language,Indent,BulletedList,NumberedList,Outdent,Blockquote,CreateDiv,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock,BidiLtr,BidiRtl,HorizontalRule,SpecialChar,PageBreak,Styles,Format,BGColor,PasteText,CopyFormatting,Strike,Select,Scayt'
    };
    setInterval(() => {
      this.job_offer_log = '';
    }, 5000);
    this.length = '';
    this.log = '';
    this.info = [];
    this.msg = '';

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!this.currentUser) {
      this.router.navigate(['/login']);
    }
    else if (this.currentUser && this.currentUser.type == 'company') {
      if (isPlatformBrowser(this.platformId)) $('.selectpicker').selectpicker('refresh');

      this.rolesData.sort(function (a, b) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });

      this.authenticationService.getCurrentCompany(this.currentUser._id, false)
        .subscribe(
          data => {
            if (data['terms'] === false) {
              this.router.navigate(['/company_wizard']);
            }
            else if (!data['company_founded'] && !data['no_of_employees'] && !data['company_funded'] && !data['company_description']) {
              this.router.navigate(['/about_comp']);
            }
            else if (!data['job_ids'] || ((new Date(data['_creator'].created_date) > new Date('2018/11/27')) && data['job_ids'].length === 0)  || !data['when_receive_email_notitfications']) {
              this.router.navigate(['/preferences']);

            }
            else if (new Date(data['_creator']['created_date']) < new Date('2018/11/28') && !data['job_ids']) {
              this.router.navigate(['/company_profile']);
            }
            else if(!data['pricing_plan']) this.router.navigate(['/pricing']);

            else if(constants.eu_countries.indexOf(data['company_country']) === -1) {
              if ((data['canadian_commercial_company'] === true || data['canadian_commercial_company'] === false) || (data['usa_privacy_shield'] === true || data['usa_privacy_shield'] === false) || data['dta_doc_link']) {
                this.mapData(data);
              }
              else this.router.navigate(['/gdpr-compliance']);
            }
            else this.mapData(data);
          },
          error => {
            if (error.message === 500) {
              localStorage.setItem('jwt_not_found', 'Jwt token not found');
              localStorage.removeItem('currentUser');
              localStorage.removeItem('googleUser');
              localStorage.removeItem('close_notify');
              localStorage.removeItem('linkedinUser');
              localStorage.removeItem('admin_log');
              window.location.href = '/login';
            }
            if (error.message === 403)
              this.router.navigate(['/not_found']);
          });
    }
    else this.router.navigate(['/not_found']);
  }

  fillFields(searches, name) {
    this.selectedValueArray = [];
    this.commercialSkillsFromDB = [];
    this.selectedCommercialSkillsNew = [];
    for (let key of searches) {
      if (key['name'] === name) {
        this.saveSearchName = name;
        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => {
            $('.selectpicker').selectpicker();
          }, 200);

          setTimeout(() => {
            $('.selectpicker').selectpicker('refresh');
          }, 300);
        }

        if (key['locations']) {
          this.prefillLocationFEFormat(key['locations']);
        }

        if (key['_id']) this._id = key['_id'];
        else this._id = '';

        if (key['visa_needed']) this.visa_check = key['visa_needed'];
        else this.visa_check = false;

        if (key['positions']) this.role_value = key['positions'];
        else this.role_value = [];

        if (key['expected_salary_min']) this.salary = key['expected_salary_min'];
        else this.salary = '';

        if (key['expected_salary_min'] && key['currency']) this.currencyChange = key['currency'];
        else this.currencyChange = '';

        if (key['expected_hourly_rate_min']) this.hourly_rate = key['expected_hourly_rate_min'];
        else this.hourly_rate = '';

        if (key['expected_hourly_rate_min'] && key['currency']) this.contractorCurrency = key['currency'];
        else this.contractorCurrency = '';

        if (key['work_type']) this.selectedWorkType = key['work_type'];
        else this.selectedWorkType = '';

        if (key['required_skills'] && key['required_skills'].length > 0) {
          this.commercialSkillsFromDB = key['required_skills'];
          this.selectedCommercialSkillsNew = this.commercialSkillsFromDB;

          this.selectedSkillExpYear = key['required_skills'];
        }
        if (isPlatformBrowser(this.platformId)) $('.selectpicker').selectpicker('refresh');
      }
    }
  }

  searchdata(key, value) {
    console.log(key);
    console.log(value);

    this.searchData = false;
    this.newSearchLocation = [];
    this.success_msg = '';
    if (key === 'searchName') {
      this.error_msg = '';
      this.fillFields(this.savedSearches, value);
    }

    this.log = '';
    this.candidate_data = '';
    this.verify_msg = "";
    this.responseMsg = "";
    this.not_found = '';
    if (isPlatformBrowser(this.platformId)) {
      $('.selectpicker').selectpicker('refresh');
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh');
      }, 500);
    }

    console.log('before if');
    if (this.selectedValueArray && this.selectedValueArray.length > 0) this.newSearchLocation = this.filter_array(this.selectedValueArray);
    if (this.newSearchLocation && this.newSearchLocation.length > 0) this.selectedValueArray = this.filter_array(this.newSearchLocation);
    //else {
    console.log('in else');
    this.not_found = '';
    let queryBody: any = {};

    //if(this.commercialSkillsFromDB && this.commercialSkillsFromDB.length > 0)
      //this.selectedCommercialSkillsNew = this.commercialSkillsFromDB;

    console.log(this.selectedCommercialSkillsNew);

    if (this.selectedWorkType) queryBody.work_type = this.selectedWorkType;
    if (this.searchWord) queryBody.why_work = this.searchWord;
    if (this.selectedValueArray && this.selectedValueArray.length > 0) queryBody.locations = this.filter_array(this.selectedValueArray);
    if (this.role_value && this.role_value.length > 0) queryBody.roles = this.role_value;
    if (this.visa_check) queryBody.visa_needed = this.visa_check;

    if (this.selectedWorkType === 'employee' && this.salary && this.currencyChange && this.currencyChange !== 'Currency') {
      queryBody.current_salary = this.salary;
      queryBody.current_currency = this.currencyChange;
    }

    if (this.selectedWorkType === 'contractor' && this.hourly_rate && this.contractorCurrency && this.contractorCurrency !== 'Currency') {
      queryBody.expected_hourly_rate = this.hourly_rate;
      queryBody.current_currency = this.contractorCurrency;
    }
    if(this.selectedSkillExpYear && this.selectedSkillExpYear.length > 0) {
      let requiredSkills = [];
      for (let skill of this.selectedSkillExpYear){
        let obj = {
          name: skill.name,
          skills_id: skill.skills_id,
          type: skill.type
        };
        if(skill.exp_year)
          obj['exp_year'] = skill.exp_year;

        requiredSkills.push(obj);
      }
      console.log(requiredSkills);
      queryBody.required_skills = requiredSkills;
    }
    let newQueryBody: any = {};
    newQueryBody = queryBody;
    if (this.saveSearchName) {
      newQueryBody.searchName = this.saveSearchName;
    }

    this.router.navigate(['candidate-search'], {
      queryParams: {queryBody: JSON.stringify(newQueryBody)}
    });

    console.log(this.selectedCommercialSkillsNew);
    console.log(queryBody);
    this.authenticationService.filterSearch(queryBody)
      .subscribe(
        data => {
          this.candidate_data = data;
          this.alreadyApproachedCheck();
          this.searchData = true;

          this.setPage(1);
          if(this.candidate_data && this.candidate_data.length > 0) {
            this.not_found='';
          }
          this.responseMsg = "response";
        },
        error => {
          this.not_found = '';
          if (error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
            this.responseMsg = "error";
            this.not_found = error['error']['message'];
          }
          else if (error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
            this.responseMsg = "error";
            this.not_found = error['error']['message'];
          }
          else {
            this.log = 'Something went wrong';
          }

        });
    //}
  }

  reset() {
    this.salary = '';
    this.info = [];
    this.searchWord = '';
    this.skill_value = '';
    this.selectedValueArray = [];
    this.newSearchLocation = [];
    this.role_value = '';
    this.currencyChange = '';
    this.visa_check = false;
    this.saveSearchName = '';
    this.selectedWorkType = '';
    this.hourly_rate = '';
    this.contractorCurrency = '';
    this.commercialSkillsFromDB = [];
    this.selectedCommercialSkillsNew = [];

    this.selectedSkillExpYear = [];

    if (isPlatformBrowser(this.platformId)) {
      $('.selectpicker').val('default');
      $('.selectpicker').selectpicker('refresh');
    }
    this.router.navigate(['candidate-search'], {});
    this.getVerrifiedCandidate();
  }

  savedSearch() {
    if (this.saveSearchName) {
      const filtered = this.savedSearches.filter( (item) => item.name === this.saveSearchName);
      this.router.navigate(['/users/company/jobs/'+filtered[0]['_id']+'/edit']);
    }
    else this.router.navigate(['/users/company/jobs/new']);
  }

  prefillLocationFEFormat(location) {
    for (let country1 of location) {
      if (country1['remote'] === true) {
        this.selectedValueArray.push({_id: country1['_id'], name: 'Remote'});
      }
      if (country1['city']) {
        let city = country1['city'];// + ", " + country1['city'].country;
        this.selectedValueArray.push({_id: country1['_id'], city: country1['city_id'], name: city});
      }
      if (country1['country']) {
        let country = country1['country'] + ' (country)';
        this.selectedValueArray.push({_id: country1['_id'], name:  country});
      }
    }

    this.selectedValueArray.sort();
    if (this.selectedValueArray.find((obj => obj.name === 'Remote'))) {
      let remoteValue = this.selectedValueArray.find((obj => obj.name === 'Remote'));
      this.selectedValueArray.splice(0, 0, remoteValue);
      this.selectedValueArray = this.filter_array(this.selectedValueArray);

    }
  }

  checkNumber(salary) {
    return /^[0-9]*$/.test(salary);
  }

  getVerrifiedCandidate() {
    this.log = '';
    this.candidate_data = '';
    this.verify_msg = "verified candidate";
    this.responseMsg = '';
    this.not_found = '';
    this.authenticationService.getVerrifiedCandidate(this.currentUser._id)
      .subscribe(
        dataa => {
          this.candidate_data = dataa;
          this.alreadyApproachedCheck();

          this.setPage(1);
          if(this.candidate_data && this.candidate_data.length > 0) {
            this.not_found='';
          }
          this.responseMsg = "response";
        },

        error => {
          if (error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
            this.responseMsg = "error";
            this.not_found = error['error']['message'];
          }
          else if (error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
            this.responseMsg = "error";
            this.not_found = error['error']['message'];
          }
          else {
            this.log = 'Something went wrong';
          }

        });
    this.authenticationService.getCurrentCompany(this.currentUser._id, false)
      .subscribe(
        data => {
          this.company_name = data['company_name'];
        },
        error => {
          if (error['message'] === 500 || error['message'] === 401) {
            localStorage.setItem('jwt_not_found', 'Jwt token not found');
            window.location.href = '/login';
          }
          if (error['message'] === 403) {
            this.router.navigate(['/not_found']);
          }
        }
      );
  }

  onSubmit(val) {
    this.user_id = val;
    this.user_name = val;
    this.job_offer_log = '';
    this.employee.job_title = '';
    this.employee.salary = '';
    this.employee.currency = '';
    this.employee.location = '';
    this.employee.job_type = '';
    this.employee.job_desc = '';
    this.job_title_log = '';
    this.location_log = '';
    this.salary_log = '';
    this.salary_currency_log = '';
    this.employment_log = '';
    this.job_desc_log = '';
    this.job_offer_log_success = '';
    this.job_offer_log_erorr = '';

    this.authenticationService.getLastJobDesc()
      .subscribe(
        data => {
          if(data && data['message'].approach) {
            let approach = data['message'].approach;

            if(approach.employee) {
              this.approach_work_type = 'employee';
              let employeeOffer = approach.employee;
              this.employee.job_title = employeeOffer.job_title;
              this.employee.min_salary = employeeOffer.annual_salary.min;
              if(employeeOffer.annual_salary && employeeOffer.annual_salary.max) {
                this.employee.max_salary = employeeOffer.annual_salary.max;
              }
              this.employee.currency = employeeOffer.currency;
              this.employee.location = employeeOffer.location;
              this.employee.job_type = employeeOffer.employment_type;
              this.employee.job_desc = employeeOffer.employment_description;
            }
            if(approach.contractor) {
              this.approach_work_type = 'contractor';
              let contractorOffer = approach.contractor;
              this.contractor.hourly_rate_min = contractorOffer.hourly_rate.min ;
              if(contractorOffer.hourly_rate && contractorOffer.hourly_rate.max) {
                this.contractor.hourly_rate_max = contractorOffer.hourly_rate.max;
              }
              this.contractor.currency = contractorOffer.currency;
              this.contractor.contract_description = contractorOffer.contract_description;
              this.contractor.location = contractorOffer.location;
            }

            if(approach.volunteer) {
              this.approach_work_type = 'volunteer';
              let volunteerOffer = approach.volunteer;
              this.volunteer.opportunity_description = volunteerOffer.opportunity_description ;
              this.volunteer.location = volunteerOffer.location;
            }
            if (isPlatformBrowser(this.platformId)) {
              setTimeout(() => {
                $('.selectpicker').selectpicker('refresh');
              }, 500);
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

          if (error['message'] === 403) {
            this.router.navigate(['/not_found']);
          }
        }
      );
  }

  approach_work_type;
  volunteer_desc_log;
  contractor_location_log;
  volunteer_location_log;
  hourly_rate_log;
  hourly_currency_log;
  contract_desc_log;
  contractor_role_log;
  max_salary_log;
  max_hourly_rate_log;
  work_log;

  send_job_offer(msgForm: NgForm) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    let errorCount = 0;
    if (this.approach_work_type === 'employee') {
      this.job_desc_log = '';
      if (!this.employee.job_title) {
        this.job_title_log = 'Please enter job title';
        errorCount = 1;
      }
      if (!this.employee.location) {
        this.location_log = 'Please enter location';
        errorCount = 1;
      }
      if (!this.employee.min_salary) {
        this.salary_log = 'Please enter minimum salary';
        errorCount = 1;
      }
      if(this.employee.min_salary && !this.checkNumber(this.employee.min_salary)) {
        this.salary_log = 'Salary should be a number';
        errorCount = 1;
      }
      if(this.employee.max_salary && !this.checkNumber(this.employee.max_salary)) {
        this.max_salary_log = 'Salary should be a number';
        errorCount = 1;
      }

      if(Number(this.employee.max_salary) < Number(this.employee.min_salary)) {
        errorCount = 1;
      }

      if (!this.employee.currency) {
        this.salary_currency_log = 'Please select currency';
        errorCount = 1;
      }
      if (!this.employee.job_type) {
        this.employment_log = 'Please select employment type';
        errorCount = 1;
      }
      if (!this.employee.job_desc) {
        this.job_desc_log = 'Please enter job description';
        errorCount = 1;
      }
      if (this.employee.job_desc && this.employee.job_desc.length > 3000) {
        this.job_desc_log = 'Job description should be less then 3000 characters';
        errorCount = 1;
      }
    }

    if (this.approach_work_type === 'contractor') {
      this.contract_desc_log = '';
      if (!this.contractor.hourly_rate_min) {
        this.hourly_rate_log = 'Please enter hourly rate';
        errorCount = 1;
      }

      if(this.contractor.hourly_rate_min && !this.checkNumber(this.contractor.hourly_rate_min)) {
        this.hourly_rate_log = 'Salary should be a number';
        errorCount = 1;
      }
      if(this.contractor.hourly_rate_max && !this.checkNumber(this.contractor.hourly_rate_max)) {
        this.max_hourly_rate_log = 'Salary should be a number';
        errorCount = 1;
      }
      if(Number(this.contractor.hourly_rate_min) > Number(this.contractor.hourly_rate_max)) {
        errorCount = 1;
      }
      if (!this.contractor.currency) {
        this.hourly_currency_log = 'Please enter currency';
        errorCount = 1;
      }
      if (!this.contractor.contract_description) {
        this.contract_desc_log = 'Please enter contract description';
        errorCount = 1;
      }
      if (this.contractor.contract_description && this.contractor.contract_description.length > 3000) {
        this.contract_desc_log = 'Contract description should be less then 3000 characters';
        errorCount = 1;
      }
      if (!this.contractor.location) {
        this.contractor_location_log = 'Please enter opportunity description';
        errorCount = 1;
      }
    }

    if (this.approach_work_type === 'volunteer') {
      this.volunteer_desc_log = '';
      if (!this.volunteer.opportunity_description) {
        this.volunteer_desc_log = 'Please enter opportunity description';
        errorCount = 1;
      }
      if (this.volunteer.opportunity_description && this.volunteer.opportunity_description.length > 3000) {
        this.volunteer_desc_log = 'Opportunity description should be less then 3000 characters';
        errorCount = 1;
      }
      if (!this.volunteer.location) {
        this.volunteer_location_log = 'Please enter opportunity description';
        errorCount = 1;
      }
    }

    if(!this.approach_work_type) {
      this.work_log = "Please select work type";
      errorCount = 1;
    }

    if (errorCount === 0) {
      let job_offer: any = {};
      let new_offer: any = {};
      if(this.approach_work_type === 'employee') {
        let salary :any = {}
        job_offer.job_title = this.employee.job_title;
        salary.min = Number(this.employee.min_salary);
        if(this.employee.max_salary) salary.max = Number(this.employee.max_salary);
        job_offer.annual_salary = salary;
        job_offer.currency = this.employee.currency;
        job_offer.employment_type = this.employee.job_type;
        job_offer.location = this.employee.location;
        job_offer.employment_description = this.employee.job_desc;
        new_offer.approach  = {
          employee : job_offer
        }
      }
      if(this.approach_work_type === 'contractor') {
        let hourly_rate : any = {};
        hourly_rate.min = Number(this.contractor.hourly_rate_min);
        if(this.contractor.hourly_rate_max) hourly_rate.max = Number(this.contractor.hourly_rate_max);
        job_offer.hourly_rate = hourly_rate;
        job_offer.currency = this.contractor.currency;
        job_offer.contract_description = this.contractor.contract_description;
        job_offer.location = this.contractor.location;
        new_offer.approach  = {
          contractor : job_offer
        }
      }

      if(this.approach_work_type === 'volunteer') {
        job_offer.opportunity_description = this.volunteer.opportunity_description;
        job_offer.location = this.volunteer.location;
        new_offer.approach  = {
          volunteer : job_offer
        }
      }
      this.authenticationService.send_message(this.user_id.id, 'approach', new_offer)
        .subscribe(
          data => {
            this.job_offer_log_success = 'Message successfully sent';
            this.employee = {};
            if (isPlatformBrowser(this.platformId)) $("#approachModal").modal("hide");

            this.router.navigate(['/chat']);
          },
          error => {
            if (error['status'] === 400) {
              this.job_offer_log_erorr = 'You have already approached this candidate';
            }
            if (error['status'] === 500 || error['status'] === 401) {
              localStorage.setItem('jwt_not_found', 'Jwt token not found');
              localStorage.removeItem('currentUser');
              localStorage.removeItem('googleUser');
              localStorage.removeItem('close_notify');
              localStorage.removeItem('linkedinUser');
              localStorage.removeItem('admin_log');
              window.location.href = '/login';
            }
            if (error['status'] === 404) {
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
      this.job_offer_log = 'One or more fields need to be completed. Please scroll up to see which ones.';
    }
  }

  sorting(languages){
    return languages.sort(function(a, b){
      a = a.exp_year.split('-');
      b = b.exp_year.split('-');
      if(a[0] > b[0]) { return -1; }
      if(a[0] < b[0]) { return 1; }
      return 0;
    })
  }

  setPage(page: number) {
    this.pager = this.pagerService.getPager(this.candidate_data.length, page);
    this.pagedItems = this.candidate_data.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  suggestedOptions() {
    if(this.countriesModel && this.countriesModel !== '') {
      let searchText;
      if(this.countriesModel) searchText = this.countriesModel;
      this.authenticationService.autoSuggestOptions(searchText, false)
        .subscribe(
          data => {
            if(data) {
              let citiesInput = data;
              let citiesOptions=[];
              for(let cities of citiesInput['locations']) {
                if(cities['remote'] === true) {
                  citiesOptions.push({_id: cities['_id'], name: 'Remote'});
                }
                if(cities['city']) {
                  let cityString = cities['city'].city + ", " + cities['city'].country;
                  citiesOptions.push({_id:cities['_id'] ,city : cities['city']._id , name : cityString});
                }
              }
              this.cities = this.filter_array(citiesOptions);
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
            if(error.message === 403)
              this.router.navigate(['/not_found']);
          });
    }
  }

  selectedValueFunction(e) {
    if(this.cities) {
      let citiesExist = this.cities.find(x => x.name === e);
      if(citiesExist) {
        this.countriesModel = '';

        if(this.preferncesForm) this.preferncesForm.get('location').setValue('');

        this.cities = [];
        if(this.selectedValueArray.length > 4) {
          this.error = 'You can select maximum 5 locations';
          setInterval(() => {
            this.error = "" ;
          }, 5000);
        }
        else {
          if(this.selectedValueArray.find(x => x.name === citiesExist.name)) {
            this.error = 'This location has already been selected';
            setInterval(() => {
              this.error = "" ;
            }, 4000);
          }
          else {
            if(citiesExist.city) this.selectedValueArray.push({ city:citiesExist.city , name: citiesExist.name});
            else this.selectedValueArray.push({name: citiesExist.name});
          }
          this.selectedValueArray.sort(function(a, b){
            if(a.name < b.name) { return -1; }
            if(a.name > b.name) { return 1; }
            return 0;
          });
          if(this.selectedValueArray.find((obj => obj.name === 'Remote'))){
            this.selectedValueArray.splice(0, 0, this.selectedValueArray.find(x => x.name === 'Remote'));
            this.selectedValueArray = this.filter_array(this.selectedValueArray);
          }

          this.newSearchLocation  = this.selectedValueArray;
          this.searchdata('locations' , this.selectedValueArray);
        }
      }
      else {
      }
    }


  }

  deleteLocationRow(index){
    this.selectedValueArray.splice(index, 1);
    this.newSearchLocation.splice(index, 1);
    this.searchdata('locations' , this.selectedValueArray);
  }

  filter_array(arr) {
    var hashTable = {};

    return arr.filter(function (el) {
      var key = JSON.stringify(el);
      var match = Boolean(hashTable[key]);

      return (match ? false : hashTable[key] = true);
    });
  }

  newSearchSelectedValueFunction(e) {
    if(this.cities) {
      if(this.cities.find(x => x.name === e)) {
        var value2send=document.querySelector("#countryList option[value='"+e+"']")['dataset'].value;

        this.countriesModel = '';
        this.preferncesForm.get('location').setValue('');

        this.cities = [];
        if(this.newSearchLocation.length > 4) {
          this.error = 'You can select maximum 5 locations';
          setInterval(() => {
            this.error = "" ;
          }, 5000);
        }
        else {
          if(this.newSearchLocation.find(x => x.name === e)) {
            this.error = 'This location has already been selected';
            setInterval(() => {
              this.error = "" ;
            }, 4000);
          }

          else {
            if(value2send) this.newSearchLocation.push({city:value2send , name: e});
            else this.newSearchLocation.push({ name: e});
          }
          this.newSearchLocation.sort(function(a, b){
            if(a.name < b.name) { return -1; }
            if(a.name > b.name) { return 1; }
            return 0;
          });
          if(this.newSearchLocation.find((obj => obj.name === 'Remote'))){
            this.newSearchLocation.splice(0, 0, this.newSearchLocation.find(x => x.name === 'Remote'));
            this.newSearchLocation = this.filter_array(this.newSearchLocation);
          }
          this.selectedValueArray = this.newSearchLocation;
          console.log(this.selectedValueArray);
          //this.searchdata('locations' , this.selectedValueArray);
        }
      }
      else {
      }
    }
  }

  deleteNewLocationRow(index) {
    this.newSearchLocation.splice(index, 1);
  }

  refreshSelectBox() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh');
      }, 300);
      //this.populatePopupFields();
      //this.searchdata("work_type", this.workTypes);
    }
  }

  alreadyApproachedCheck(){
    for(let i=0;i<this.candidate_data.length;i++){
      this.candidate_data[i].already_approached = 0;
      if(this.candidate_data[i].initials) {
        this.authenticationService.get_user_messages_comp(this.candidate_data[i]._id)
          .subscribe(
            data => {
              if(data['messages'][0].message.approach) this.candidate_data[i].already_approached = 1;
            },
            error => {
              if (error.message === 500 || error.message === 401) {
                localStorage.setItem('jwt_not_found', 'Jwt token not found');
                window.location.href = '/login';
              }
              if (error.message === 403) {
              }
            }
          );
      }
    }
  }

  convertNumber(string) {
    return Number(string);
  }

  mapData(data){
    this.is_approved = data['_creator'].is_approved;
    this.display_name = data['company_name'];

    if (this.is_approved === 0) {
      this.disabled = true;
      this.msg = "You can access this page when your account has been approved by an admin.";
      this.log = '';
    }
    else if (data['_creator'].disable_account == true) {
      this.disabled = true;
      this.msg = "You can access this feature when your profile has been enabled. Go to setting and enable your profile";
      this.log = '';

    }
    else {
      this.disabled = false;
      if(data['job_ids'] && data['job_ids'].length > 0) {
        this.savedSearches = data['job_ids'];
        console.log(data['job_ids']);
        for (let i = 0; i < data['job_ids'].length; i++) {
          this.searchName.push(data['job_ids'][i].name);
        }
        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => {
            $('.selectpicker').selectpicker('refresh');
          }, 300);
        }
      }
      if (!this.no_value) {
        this.getVerrifiedCandidate();
      }
    }
  }

  selectedSkill(skillObj){
    let objectMap = {};
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh');
      }, 500);
    }
    if(this.selectedSkillExpYear.find(x => x['name'] === skillObj.name)) {
      this.errorMsg = 'This skills has already been selected';
      return false;
    }
    else {
      objectMap = {skills_id:skillObj._id ,  name: skillObj.name, type: skillObj.type};
      if(skillObj.type === 'blockchain')
        objectMap['img'] = makeImgCode(skillObj);
      if(skillObj.type === 'language')
        objectMap['img'] = makeIconCode('fas fa-code');
      if(skillObj.type === 'experience')
        objectMap['img'] = makeIconCode('fas fa-user-friends');
      this.selectedSkillExpYear.push(objectMap);
    }
    console.log(this.selectedSkillExpYear);
    this.searchdata('requiredSkills',this.selectedSkillExpYear);
  }

  skillsExpYearOptions(event, value, index){
    this.selectedSkillExpYear[index].exp_year = parseInt(event.target.value);
    this.searchdata('requiredSkills',this.selectedSkillExpYear)
  }

  deleteSkill(index){
    this.selectedSkillExpYear.splice(index, 1);
    this.searchdata('requiredSkills',this.selectedSkillExpYear)
  }

}
