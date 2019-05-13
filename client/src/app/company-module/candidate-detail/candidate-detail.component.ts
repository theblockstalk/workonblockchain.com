import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
import {NgForm} from '@angular/forms';
import { DataService } from '../../data.service';
declare var $:any;
import {constants} from "../../../constants/constants";
import {changeLocationDisplayFormat, getNameFromValue} from "../../../services/object";

@Component({
  selector: 'app-candidate-detail',
  templateUrl: './candidate-detail.component.html',
  styleUrls: ['./candidate-detail.component.css']
})
export class CandidateDetailComponent implements OnInit, AfterViewInit   {
  id;
  user_id;
  first_name;
  last_name;
  description;
  companyname;
  degreename;
  interest_area;
  why_work;
  availability_day;
  countries;
  history;
  education;
  experimented;
  languages;
  current_currency;
  current_salary;
  image_src;
  nationality;
  contact_number;
  platforms;
  github;
  stack;
  expected_salary;
  email;
  visaRequiredArray= [];
  noVisaArray = [];
  currency = constants.currencies;
  description_commercial_platforms;
  description_experimented_platforms;
  description_commercial_skills;
  employee: any = {};
  contractor:any = {};
  volunteer: any = {};
  roles = constants.workRoles;
  contractorTypes = constants.contractorTypes;
  date_of_joining;
  msg_tag;
  is_company_reply = 0;
  msg_body;
  job_offer_msg;
  job_offer_msg_success;
  full_name;
  job_description;
  job_title_log;
  location_log;
  salary_log;
  salary_currency_log;
  employment_log;
  job_desc_log;
  job_offer_log_erorr;
  approach_work_type;
  volunteer_desc_log;
  hourly_rate_log;
  hourly_currency_log;
  contract_desc_log;
  workTypes = constants.workTypes;
  rolesData = constants.workRoles;
  country_code;

  ckeConfig: any;
  @ViewChild("myckeditor") ckeditor: any;

  constructor(private dataservice: DataService , private route: ActivatedRoute,private authenticationService: UserService,private router: Router)
  {
    this.route.queryParams.subscribe(params => {
      this.user_id = params['user'];
    });
  }
  company_reply; currentUser: any;
  credentials: any = {};
  job_type = constants.job_type;
  company_name;
  interview_location = '';
  invalidMsg;

  date_sort_desc = function (date1, date2)
  {
    // DESCENDING order.
    if (date1.enddate > date2.enddate) return -1;
    if (date1.enddate < date2.enddate) return 1;
    return 0;
  };

  education_sort_desc = function (year1, year2)
  {
    // DESCENDING order.
    if (year1.eduyear > year2.eduyear) return -1;
    if (year1.eduyear < year2.eduyear) return 1;
    return 0;
  };

  cand_data=[];
  commercial;
  commercial_skills;
  formal_skills;
  message;
  selectedValueArray=[];

  ngAfterViewInit() {
    window.scrollTo(0, 0);
    setTimeout(() => {
      $('.selectpicker').selectpicker();
    }, 300);

    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh');
    }, 900);
  }
  ngOnInit()
  {
    this.invalidMsg = '';
    this.selectedValueArray=[];
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    localStorage.removeItem('previousUrl');
    if(this.currentUser && this.user_id && this.currentUser.type === 'company') {

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
                this.contractor.location = contractorOffer.location
                this.contractor.contract_description = contractorOffer.contract_description;
              }

              if(approach.volunteer) {
                this.approach_work_type = 'volunteer';
                let volunteerOffer = approach.volunteer;
                this.volunteer.opportunity_description = volunteerOffer.opportunity_description ;
                this.volunteer.location = volunteerOffer.location ;
              }
              setTimeout(() => {
                $('.selectpicker').selectpicker('refresh');
              }, 300);
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
      this.ckeConfig = {
        allowedContent: false,
        extraPlugins: 'divarea',
        forcePasteAsPlainText: true,
        removePlugins: 'resize,elementspath',
        removeButtons: 'Cut,Copy,Paste,Undo,Redo,Anchor,Bold,Italic,Underline,Subscript,Superscript,Source,Save,Preview,Print,Templates,Find,Replace,SelectAll,NewPage,PasteFromWord,Form,Checkbox,Radio,TextField,Textarea,Button,ImageButton,HiddenField,RemoveFormat,TextColor,Maximize,ShowBlocks,About,Font,FontSize,Link,Unlink,Image,Flash,Table,Smiley,Iframe,Language,Indent,BulletedList,NumberedList,Outdent,Blockquote,CreateDiv,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock,BidiLtr,BidiRtl,HorizontalRule,SpecialChar,PageBreak,Styles,Format,BGColor,PasteText,CopyFormatting,Strike,Select,Scayt'
      };
      setInterval(() => {
        this.job_offer_msg = '';
      }, 7000);
      this.company_reply = 0;
      this.credentials.user_id = this.user_id;



      this.authenticationService.candidate_detail(this.user_id)
        .subscribe(
          dataa => {
            if (dataa) {
              if(dataa['candidate'].work_history) {
                this.history = dataa['candidate'].work_history;
                this.history.sort(this.date_sort_desc);
              }

              if(dataa['candidate'].education_history) {
                this.education = dataa['candidate'].education_history;
                this.education.sort(this.education_sort_desc);
              }

              if(dataa['candidate'].employee) {
                this.employee.value = dataa['candidate'].employee;
                const locationArray = changeLocationDisplayFormat(this.employee.value.location);
                this.employee.noVisaArray = locationArray.noVisaArray;
                this.employee.visaRequiredArray = locationArray.visaRequiredArray;
                let rolesValue = [];
                for(let role of this.employee.value.roles){
                  const filteredArray = getNameFromValue(this.roles,role);
                  rolesValue.push(filteredArray.name);
                }
                this.employee.value.roles = rolesValue.sort();
                let availability = getNameFromValue(constants.workAvailability,this.employee.value.employment_availability);
                this.employee.value.employment_availability = availability.name;
              }

              if(dataa['candidate'].contractor) {
                this.contractor.value = dataa['candidate'].contractor;
                const locationArray = changeLocationDisplayFormat(this.contractor.value.location);
                this.contractor.noVisaArray = locationArray.noVisaArray;
                this.contractor.visaRequiredArray = locationArray.visaRequiredArray;
                let rolesValue = [];
                for(let role of this.contractor.value.roles){
                  const filteredArray = getNameFromValue(this.roles,role);
                  rolesValue.push(filteredArray.name);
                }
                this.contractor.value.roles = rolesValue.sort();
                let contractorType = [];
                for(let type of this.contractor.value.contractor_type) {
                  const filteredArray = getNameFromValue(this.contractorTypes , type);
                  contractorType.push(filteredArray.name);
                }
                this.contractor.value.contractor_type = contractorType;
              }

              if(dataa['candidate'].volunteer) {
                this.volunteer.value = dataa['candidate'].volunteer;
                const locationArray = changeLocationDisplayFormat(this.volunteer.value.location);
                this.volunteer.noVisaArray = locationArray.noVisaArray;
                this.volunteer.visaRequiredArray = locationArray.visaRequiredArray;
                let rolesValue = [];
                for(let role of this.volunteer.value.roles){
                  const filteredArray = getNameFromValue(this.roles,role);
                  rolesValue.push(filteredArray.name);
                }
                this.volunteer.value.roles = rolesValue.sort();
              }

              this.contact_number = '';
              if(dataa['contact_number']) {
                let contact_number = dataa['contact_number'];
                contact_number = contact_number.replace(/^00/, '+');
                contact_number = contact_number.split(" ");
                if(contact_number.length>1) {
                  for (let i = 0; i < contact_number.length; i++) {
                    if (i === 0) this.country_code = '('+contact_number[i]+')';
                    else this.contact_number = this.contact_number+''+contact_number[i];
                  }
                  this.contact_number = this.country_code+' '+this.contact_number
                }
                else this.contact_number = contact_number[0];

                dataa['contact_number'] = this.contact_number;
              }


              this.cand_data.push(dataa);
              this.first_name = dataa['initials'];
              if(dataa['candidate'].availability_day === '1 month') this.availability_day = '1 month notice period';
              else if(dataa['candidate'].availability_day === '2 months') this.availability_day = '2 months notice period';
              else if(dataa['candidate'].availability_day === '3 months') this.availability_day = '3 months notice period';
              else if(dataa['candidate'].availability_day === 'Longer than 3 months') this.availability_day = '3+ months notice period';
              else this.availability_day =dataa['candidate'].availability_day;
              if(dataa['candidate'].locations)
              {
                let citiesArray = [];
                let countriesArray = [];
                for (let country1 of dataa['candidate'].locations)
                {
                  let locObject : any = {}
                  if (country1['remote'] === true) {
                    this.selectedValueArray.push({name: 'Remote' , visa_needed : false});
                  }

                  if (country1['country']) {
                    locObject.name = country1['country'];
                    locObject.type = 'country';
                    if(country1['visa_needed'] === true) locObject.visa_needed = true;
                    else locObject.visa_needed = false;
                    countriesArray.push(locObject);
                    countriesArray.sort(function(a, b){
                      if(a.name < b.name) { return -1; }
                      if(a.name > b.name) { return 1; }
                      return 0;
                    });
                  }
                  if (country1['city']) {
                    let city = country1['city'].city + ", " + country1['city'].country;
                    locObject.name = city;
                    locObject.type = 'city';
                    if(country1['visa_needed'] === true) locObject.visa_needed = true;
                    else locObject.visa_needed = false;
                    citiesArray.push(locObject);
                    citiesArray.sort(function(a, b){
                      if(a.name < b.name) { return -1; }
                      if(a.name > b.name) { return 1; }
                      return 0;
                    });
                  }
                }

                this.countries = citiesArray.concat(countriesArray);
                this.countries = this.countries.concat(this.selectedValueArray);
                if(this.countries.find((obj => obj.name === 'Remote'))) {
                  let remoteValue = this.countries.find((obj => obj.name === 'Remote'));
                  this.countries.splice(0, 0, remoteValue);
                  this.countries = this.filter_array(this.countries);
                }
                if(this.countries && this.countries.length > 0) {

                  for(let loc of this.countries) {
                    if(loc.visa_needed === true)
                      this.visaRequiredArray.push(loc);
                    if(loc.visa_needed === false)
                      this.noVisaArray.push(loc);
                  }
                }

              }

              this.interest_area =dataa['candidate'].interest_areas;
              this.interest_area.sort();
              let new_roles = constants.workRoles;
              let filtered_array = [];

              this.languages= dataa['candidate'].programming_languages;
              if(this.languages && this.languages.length>0){
                this.languages.sort(function(a, b){
                  if(a.language < b.language) { return -1; }
                  if(a.language > b.language) { return 1; }
                  return 0;
                })
              }

              if(dataa['candidate'] && dataa['candidate'].blockchain) {
                if (dataa['candidate'].blockchain.commercial_skills) {
                  this.commercial_skills = dataa['candidate'].blockchain.commercial_skills;
                  this.commercial_skills.sort(function (a, b) {
                    if (a.skill < b.skill) {
                      return -1;
                    }
                    if (a.skill > b.skill) {
                      return 1;
                    }
                    return 0;
                  })
                }

                if (dataa['candidate'].blockchain.commercial_platforms) {
                  this.commercial = dataa['candidate'].blockchain.commercial_platforms;
                  if (this.commercial && this.commercial.length > 0) {
                    this.commercial.sort(function (a, b) {
                      if (a.platform_name < b.platform_name) {
                        return -1;
                      }
                      if (a.platform_name > b.platform_name) {
                        return 1;
                      }
                      return 0;
                    });
                  }
                }

                if (dataa['candidate'].blockchain.experimented_platforms) {
                  this.experimented = dataa['candidate'].blockchain.experimented_platforms;
                  if (this.experimented && this.experimented.length > 0) {
                    this.experimented.sort(function (a, b) {
                      if (a < b) {
                        return -1;
                      }
                      if (a > b) {
                        return 1;
                      }
                      return 0;
                    });
                  }
                }

                if(dataa['candidate'].blockchain.description_commercial_platforms) {
                  this.description_commercial_platforms = dataa['candidate'].blockchain.description_commercial_platforms;
                }

                if(dataa['candidate'].blockchain.description_experimented_platforms) {
                  this.description_experimented_platforms = dataa['candidate'].blockchain.description_experimented_platforms;
                }

                if(dataa['candidate'].blockchain.description_commercial_skills) {
                  this.description_commercial_skills = dataa['candidate'].blockchain.description_commercial_skills;
                }
              }

            }
          },
          error => {
            if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              this.router.navigate(['/not_found']);
            }

          });
      this.authenticationService.getCurrentCompany(this.currentUser._id)
        .subscribe(
          data => {
            this.company_name = data['company_name'];
          },
          error => {
            if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              this.router.navigate(['/not_found']);
            }

          });

    }

    else if(this.currentUser && this.user_id  && this.currentUser.type === 'candidate') {
      this.invalidMsg = "Please log in with an approved company account to view this profile";
    }
    else
    {
      const location = window.location.href.split('/');
      window.localStorage.setItem('previousUrl', location[3]);
      this.router.navigate(['/login']);

    }
  }

  volunteer_location_log;
  contractor_location_log;
  contractor_role_log;
  max_salary_log;
  max_hourly_rate_log;
  work_log;
  send_job_offer(msgForm: NgForm) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    let errorCount = 0;
    if (this.approach_work_type === 'employee') {
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
    }

    if (this.approach_work_type === 'contractor') {
      if (!this.contractor.location) {
        this.contractor_location_log = 'Please enter location';
        errorCount = 1;
      }
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
    }

    if (this.approach_work_type === 'volunteer') {
      if (!this.volunteer.location) {
        this.volunteer_location_log = 'Please enter location';
        errorCount = 1;
      }
      if (!this.volunteer.opportunity_description) {
        this.volunteer_desc_log = 'Please enter opportunity description';
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
        let salary:any = {};
        job_offer.job_title = this.employee.job_title;
        salary.min = Number(this.employee.min_salary);
        if(this.employee.max_salary) salary.max = Number(this.employee.max_salary);
        job_offer.annual_salary = salary;        job_offer.currency = this.employee.currency;
        job_offer.employment_type = this.employee.job_type;
        job_offer.location = this.employee.location;
        job_offer.employment_description = this.employee.job_desc;
        new_offer.approach  = {
          employee : job_offer
        }
      }
      if(this.approach_work_type === 'contractor') {
        let hourly_rate : any = {};
        job_offer.location = this.contractor.location;
        hourly_rate.min = Number(this.contractor.hourly_rate_min);
        if(this.contractor.hourly_rate_max) hourly_rate.max = Number(this.contractor.hourly_rate_max);
        job_offer.hourly_rate = hourly_rate;        job_offer.currency = this.contractor.currency;
        job_offer.contract_description = this.contractor.contract_description;
        new_offer.approach  = {
          contractor : job_offer
        }
      }

      if(this.approach_work_type === 'volunteer') {
        job_offer.location = this.volunteer.location;
        job_offer.opportunity_description = this.volunteer.opportunity_description;
        new_offer.approach  = {
          volunteer : job_offer
        }
      }
      this.authenticationService.send_message(this.credentials.user_id, 'approach', new_offer)
        .subscribe(
          data => {
            this.job_offer_msg_success = 'Message successfully sent';
            this.employee = {};
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
      this.job_offer_log_erorr = 'One or more fields need to be completed. Please scroll up to see which ones.';
    }
  }
  filter_array(arr)
  {
    var hashTable = {};

    return arr.filter(function (el) {
      var key = JSON.stringify(el);
      var match = Boolean(hashTable[key]);

      return (match ? false : hashTable[key] = true);
    });
  }

  checkNumber(salary) {
    return /^[0-9]*$/.test(salary);
  }

  changeWorkTypes(){
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh');
    }, 300);
  }
  convertNumber(string) {
    return Number(string);
  }
}
