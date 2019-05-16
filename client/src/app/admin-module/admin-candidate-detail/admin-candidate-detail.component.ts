import { Component, OnInit,ElementRef, Input, ViewChild, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
import {NgForm} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
declare var $: any;
import {constants} from '../../../constants/constants';
import {changeLocationDisplayFormat, getNameFromValue, getFilteredNames} from "../../../services/object";
import {isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'app-admin-candidate-detail',
  templateUrl: './admin-candidate-detail.component.html',
  styleUrls: ['./admin-candidate-detail.component.css']
})
export class AdminCandidateDetailComponent implements OnInit, AfterViewInit {
  @ViewChild("myckeditor") ckeditor: any;
  ckeConfig: any;

  id;user_id;
  first_name;last_name;description;companyname;degreename;
  interest_area;why_work;availability_day;
  countries;history;education;
  experimented;languages;current_currency;current_salary;image_src;
  imgPath;nationality;contact_number;
  credentials: any = {};
  admin_log;
  candidate_status;
  set_status;
  status_reason_rejected;
  status_reason_deferred;
  set_candidate_status = constants.set_candidate_status;
  set_candidate_status_rejected = constants.statusReasons_rejected;
  set_candidate_status_deferred = constants.statusReasons_deferred;
  email_subject= 'Welcome to workonblockchain.com - your account has been approved!';

  description_commercial_platforms;
  description_experimented_platforms;
  description_commercial_skills;

  employee: any = {};
  contractor:any = {};
  volunteer: any = {};
  roles = constants.workRoles;
  contractorTypes = constants.contractorTypes;
  country_code;
  templates;

  constructor(private http: HttpClient,private el: ElementRef,private route: ActivatedRoute,private authenticationService: UserService,private router: Router, @Inject(PLATFORM_ID) private platformId: Object)
  {
    this.route.queryParams.subscribe(params => {
      this.user_id = params['user'];
    });


  }
  currentUser: User;
  info=[];
  approve;verify;is_verify;information;refeered;
  work_history;education_history;
  date_sort_desc = function (date1, date2)
  {
    if (date1.enddate > date2.enddate) return -1;
    if (date1.enddate < date2.enddate) return 1;
    return 0;
  };

  education_sort_desc = function (year1, year2)
  {
    if (year1.eduyear > year2.eduyear) return -1;
    if (year1.eduyear < year2.eduyear) return 1;
    return 0;
  };

  commercial;
  platforms;
  email;
  response;
  referred_name;
  referred_link;
  detail_link;
  commercial_skills;
  formal_skills;
  created_date;
  selectedValueArray=[];
  visaRequiredArray = [];
  noVisaArray = [];
  candidateHistory;
  _id;
  send_email;
  templateDoc;

  ngAfterViewInit(): void
  {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        $('.selectpicker').selectpicker();
      }, 300);

      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh');
      }, 600);
    }
    window.scrollTo(0, 0);

  }


  ngOnInit()
  {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        $('.selectpicker').selectpicker();
      }, 300);

      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh');
      }, 500);
    }

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.admin_log = JSON.parse(localStorage.getItem('admin_log'));

    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      height: '12rem',
      minHeight: '10rem',
    };

    this.credentials.user_id = this.user_id;

    this.response = "";
    this.referred_link = "";
    this.referred_name = "";
    this.error = "";


    if(this.user_id && this.admin_log && this.currentUser)
    {
      if(this.admin_log.is_admin == 1)
      {
        this.getTemplateOptions();
        this.authenticationService.getCandidateProfileById(this.user_id, true)
          .subscribe(
            data => {
              this._id  = data['_id'];
              if(data['candidate'].employee) {
                this.employee.value = data['candidate'].employee;
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

              if(data['candidate'].contractor) {
                this.contractor.value = data['candidate'].contractor;
                const locationArray = changeLocationDisplayFormat(this.contractor.value.location);
                this.contractor.noVisaArray = locationArray.noVisaArray;
                this.contractor.visaRequiredArray = locationArray.visaRequiredArray;
                let rolesValue = [];
                for(let role of this.contractor.value.roles){
                  const filteredArray = getNameFromValue(this.roles,role);
                  rolesValue.push(filteredArray.name);
                }
                this.contractor.value.roles = rolesValue;
                let contractorType = [];
                for(let type of this.contractor.value.contractor_type) {
                  const filteredArray = getNameFromValue(this.contractorTypes , type);
                  contractorType.push(filteredArray.name);
                }
                this.contractor.value.contractor_type = contractorType.sort();
              }

              if(data['candidate'].volunteer) {
                this.volunteer.value = data['candidate'].volunteer;
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
              this.candidateHistory = data['candidate'].history;
              this.candidate_status = data['candidate'].latest_status;
              this.created_date = data['candidate'].history[data['candidate'].history.length-1].timestamp;
              setTimeout(() => {
                $('.selectpicker').selectpicker('refresh');
              }, 200);

              this.contact_number = '';
              let contact_number = data['contact_number'];
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

              data['contact_number'] = this.contact_number;

              this.info.push(data);
              this.verify =data['is_verify'];

              if(data['candidate'].work_history) {
                this.work_history = data['candidate'].work_history;
                this.work_history.sort(this.date_sort_desc);
              }

              if(data['candidate'].education_history) {
                this.education_history = data['candidate'].education_history;
                this.education_history.sort(this.education_sort_desc);
              }

              if(data['candidate'].locations)
              {
                let citiesArray = [];
                let countriesArray = [];
                for (let country1 of data['candidate'].locations)
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

              this.interest_area =data['candidate'].interest_areas;
              if(this.interest_area) this.interest_area.sort();

              this.languages= data['candidate'].programming_languages;
              if(this.languages && this.languages.length>0){
                this.languages.sort(function(a, b){
                  if(a.language < b.language) { return -1; }
                  if(a.language > b.language) { return 1; }
                  return 0;
                })
              }

              if(data['candidate'] && data['candidate'].status){
                this.created_date = data['candidate'].status[data['candidate'].status.length-1].timestamp;
              }

              if(data['candidate'] && data['candidate'].blockchain) {

                if(data['candidate'].blockchain.commercial_skills) {
                  this.commercial_skills = data['candidate'].blockchain.commercial_skills;
                  this.commercial_skills.sort(function(a, b){
                    if(a.skill < b.skill) { return -1; }
                    if(a.skill > b.skill) { return 1; }
                    return 0;
                  })
                }

                if(data['candidate'].blockchain.commercial_platforms){
                  this.commercial = data['candidate'].blockchain.commercial_platforms;
                  if(this.commercial && this.commercial.length>0){
                    this.commercial.sort(function(a, b){
                      if(a.platform_name < b.platform_name) { return -1; }
                      if(a.platform_name > b.platform_name) { return 1; }
                      return 0;
                    })
                  }
                }
                if(data['candidate'].blockchain.experimented_platforms){
                  this.experimented = data['candidate'].blockchain.experimented_platforms;
                  if(this.experimented && this.experimented.length>0){
                    this.experimented.sort(function(a, b){
                      if(a < b) { return -1; }
                      if(a > b) { return 1; }
                      return 0;
                    })
                  }
                }
                if(data['candidate'].blockchain.commercial_skills) {
                  this.commercial_skills = data['candidate'].blockchain.commercial_skills;
                  this.commercial_skills.sort(function(a, b){
                    if(a.skill < b.skill) { return -1; }
                    if(a.skill > b.skill) { return 1; }
                    return 0;
                  })
                }

                if(data['candidate'].blockchain.description_commercial_platforms) {
                  this.description_commercial_platforms = data['candidate'].blockchain.description_commercial_platforms;
                }

                if(data['candidate'].blockchain.description_experimented_platforms) {
                  this.description_experimented_platforms = data['candidate'].blockchain.description_experimented_platforms;
                }

                if(data['candidate'].blockchain.description_commercial_skills) {
                  this.description_commercial_skills = data['candidate'].blockchain.description_commercial_skills;
                }

              }


              if(data['image'] != null )
              {

                this.imgPath =  data['image'];

              }

              if(this.approve === 1)
              {
                this.is_approved = "Aprroved";
              }

              else
              {
                this.is_approved = "";
              }

              if(data['referred_email'])
              {
                this.authenticationService.getReferenceDetail(data['referred_email'])
                  .subscribe(
                    refData => {
                      if(refData['candidateDoc']){
                        if(refData['candidateDoc']['first_name'] && refData['candidateDoc']['last_name'])
                          this.referred_name = refData['candidateDoc']['first_name'] + " " + refData['candidateDoc']['last_name'];
                        else
                          this.referred_name = refData['candidateDoc']._id ;


                        this.detail_link = '/admin-candidate-detail';
                        this.referred_link = refData['candidateDoc']._id;
                      }
                      else if(refData['companyDoc']){
                        if(refData['companyDoc'].first_name && refData['companyDoc'].last_name)
                          this.referred_name = refData['companyDoc'].first_name + " " + refData['companyDoc'].last_name;
                        else
                          this.referred_name = refData['companyDoc']._id ;

                        this.detail_link = '/admin-company-detail';
                        this.referred_link = refData['companyDoc']._creator._id;
                      }
                      else
                      {
                        this.referred_name = refData['refDoc'].email;
                      }

                    },
                    error => {
                      if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false)
                      {
                        this.error = error['error']['message'];
                      }
                      else if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false)
                      {
                        this.error = error['error']['message'];
                      }
                      else
                      {
                        this.error = error['error']['message'];
                      }

                    }
                  );
              }

            },

            error =>
            {
              if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
                this.router.navigate(['/not_found']);
              }

            });
        setTimeout(() => {
          $('.selectpicker').selectpicker('refresh');
        }, 200);
      }
      else
      {
        this.router.navigate(['/not_found']);

      }
    }
    else
    {
      this.router.navigate(['/not_found']);

    }
  }

  getTemplateOptions()  {
    this.templates = [];
    this.authenticationService.email_templates_get()
      .subscribe(
        data =>
        {
          this.templateDoc = data;
          for(let i = 0; i < data['length']; i++) {
              this.templates.push(data[i].name);
          }
          setTimeout(() => {
            $('.selectpicker').selectpicker('refresh');
          }, 300);
        },
        error =>
        {
          if(error.message === 403)
          {
            this.router.navigate(['/not_found']);
          }
        });
  }

  changeStatus(event){
    if(event === 'Rejected' || event === 'rejected'){
      if (isPlatformBrowser(this.platformId)) {
        $("#sel1-reason-deferred").css('display', 'none');
        $("#sel1-reason-rejected").css('display', 'block');
      }
    }
    if(event === 'Deferred' || event === 'deferred'){
      if (isPlatformBrowser(this.platformId)) {
        $("#sel1-reason-rejected").css('display', 'none');
        $("#sel1-reason-deferred").css('display', 'block');
      }
    }
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh');
      }, 200);
    }
  }

  is_approve;is_approved;
  error;
  success;
  status_error;
  approveClick(approveForm: NgForm) {
    this.error = '';
    this.success = '';
    if(!approveForm.value.set_status && !approveForm.value.note && !approveForm.value.send_email) {
      this.error = 'Please fill at least one field';
    }

    else {
      if (approveForm.value.set_status === "Rejected" || approveForm.value.set_status === "rejected") {
        if (approveForm.value.status_reason_rejected) {
          this.saveApproveData(approveForm.value);
        }
        else {
          this.status_error = 'Please select a reason';
          this.error = 'One or more fields need to be completed. Please scroll up to see which ones.';
        }
      }
      else if (approveForm.value.set_status === "Deferred" || approveForm.value.set_status === "deferred") {
        if (approveForm.value.status_reason_deferred) {
          this.saveApproveData(approveForm.value);
        }
        else {
          this.status_error = 'Please select a reason';
          this.error = 'One or more fields need to be completed. Please scroll up to see which ones.';
        }
      }
      else if(approveForm.value.send_email && approveForm.value.email_text && !approveForm.value.email_subject) {
        this.error = 'Please enter email subject too.';

      }

      else if(approveForm.value.send_email && !approveForm.value.email_text && approveForm.value.email_subject) {
        this.error = 'Please enter email body too.';

      }
      else {
        this.saveApproveData(approveForm.value);
        approveForm.resetForm();
      }
    }

  }
  note;
  email_text;
  status;
  reason;
  saveApproveData(approveForm) {
    let queryInput : any = {};

    if(approveForm.note)queryInput['note'] = approveForm.note;
    if(approveForm.email_text) queryInput['email_html'] = approveForm.email_text;
    if(approveForm.email_subject) queryInput['email_subject'] = approveForm.email_subject;
    if(approveForm.set_status) queryInput['status'] = approveForm.set_status;
    if(approveForm.status_reason_rejected) queryInput['reason'] = approveForm.status_reason_rejected;
    if(approveForm.status_reason_deferred) queryInput['reason'] = approveForm.status_reason_deferred;


    this.authenticationService.candidate_status_history(this._id, queryInput, true)
      .subscribe(
        data => {
          this.candidateHistory = data['candidate'].history;
          this._id  = data['_id'];
          let statusCount = 0;
          for(let history of this.candidateHistory) {
            if(statusCount === 0 && history.status) {
              this.candidate_status = history.status;
              statusCount = 1;
            }
          }
          this.reset();
          this.email_subject= 'Welcome to workonblockchain.com - your account has been approved!';
          if (isPlatformBrowser(this.platformId)) {
            $('.selectpicker').val('default');
            $('.selectpicker').selectpicker('refresh');
          }
          this.success = "Successfully updated";
          setTimeout(() => {
            this.success = '';
          }, 1000);

        },
        error => {
          if (error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
            this.error = error['error']['message'];
          }
          if (error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
            this.error = error['error']['message'];
          }
          else {
            this.error = "Something went wrong";
          }
        });
  }

  reset() {
    this.set_status = '';
    this.status_reason_rejected = '';
    this.status_reason_deferred = '';
    this.note = '';
    this.email_text = '';
    this.send_email = false;
  }

  filter_array(arr) {
    var hashTable = {};
    return arr.filter(function (el) {
      var key = JSON.stringify(el);
      var match = Boolean(hashTable[key]);
      return (match ? false : hashTable[key] = true);
    });
  }

  website_url;
  websiteUrl(link) {
    let loc = link;
    let x = loc.split("/");
    if (x[0] === 'http:' || x[0] === 'https:') {
      this.website_url = link;
      return this.website_url;
    }
    else {
      this.website_url = 'http://' + link;
      return this.website_url;
    }
  }

  refreshSelect(){
    setTimeout(() => {
      $('.selectpicker').selectpicker();
    }, 200);
  }

  selectTemplate(event, name){
    let template = this.templateDoc.find(x => x.name === event.target.value);
    if(name === 'note') {
      this.note = template.body;
    }
    else  {
      if('subject' in template) this.email_subject = template.subject;
      this.email_text = template.body;
    }
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh');
    }, 200);
  }
}
