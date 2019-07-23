import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import {NgForm} from '@angular/forms';
import {constants} from '../../../constants/constants';
import {changeLocationDisplayFormat, getNameFromValue} from "../../../services/object";

declare var $: any;

@Component({
  selector: 'app-p-candidate-view',
  templateUrl: './candidate-view.component.html',
  styleUrls: ['./candidate-view.component.css']
})
export class CandidateViewComponent implements OnInit {
  @Input() userDoc: object;
  @Input() viewBy: string; // "admin", "candidate", company
  @Input() anonimize: boolean; //true/false for view by company

  //http://localhost:4200/admins/talent/5ced0aa45b3fda10fc2aef2b/

  routerUrl;
  user_id;
  candidate_image;
  referred_name = '';
  referred_link;
  detail_link;
  candidate_status;
  created_date;
  candidateHistory;
  set_status;
  status_reason_rejected;
  status_reason_deferred;
  set_candidate_status = constants.set_candidate_status;
  set_candidate_status_rejected = constants.statusReasons_rejected;
  set_candidate_status_deferred = constants.statusReasons_deferred;
  roles = constants.workRoles;
  contractorTypes = constants.contractorTypes;
  workTypes = constants.workTypes;
  currency = constants.currencies;
  job_type = constants.job_type;
  base_countries = constants.countries;
  job_activities = constants.job_activity_status;
  add_note_options = constants.add_note_options;
  add_email_options = constants.add_email_options;
  email_subject= 'Welcome to workonblockchain.com - your account has been approved!';
  status_error;
  add_note;
  templates;
  note_template;
  templateDoc;
  note;
  email_text;
  send_email;
  email_template;
  success;
  error;
  progress_bar_value = 15;
  linked_websites;
  progress_bar_class = 'progress-bar bg-warning';
  work_history_progress = 0;
  commercial_skills;
  commercial;
  experimented;
  description_commercial_platforms;
  description_experimented_platforms;
  description_commercial_skills;
  employee: any = {};
  contractor:any = {};
  volunteer: any = {};
  interest_area;
  languages;
  work_history;
  education_history;
  already_approached = 0;
  approach_work_type;
  ckeConfig: any;
  @ViewChild("myckeditor") ckeditor: any;
  job_offer_log_erorr;
  job_offer_log_success;
  job_title_log;
  location_log;
  salary_log;
  max_salary_log;
  salary_currency_log;
  employment_log;
  job_desc_log;
  contractor_location_log;
  hourly_rate_log;
  max_hourly_rate_log;
  contract_desc_log;
  volunteer_location_log;
  volunteer_desc_log;
  work_log;
  job_offer_msg_success;
  hourly_currency_log;
  candidateMsgTitle;
  candidateMsgBody;
  public loading = false;information: any = {};
  base_country;
  base_city;
  country_log;
  city_log;
  first_name;last_name;
  is_verify;
  account_status;
  job_activity_status;
  new_work_opportunities;
  currently_employed;
  leaving_reasons;
  other_reasons;
  counter_offer;
  cand_job_activity;

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

  constructor(private route: ActivatedRoute, private router: Router, private authenticationService: UserService) {}

  ngOnInit() {
    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true,
      removePlugins: 'resize,elementspath',
      removeButtons: 'Cut,Copy,Paste,Undo,Redo,Anchor,Bold,Italic,Underline,Subscript,Superscript,Source,Save,Preview,Print,Templates,Find,Replace,SelectAll,NewPage,PasteFromWord,Form,Checkbox,Radio,TextField,Textarea,Button,ImageButton,HiddenField,RemoveFormat,TextColor,Maximize,ShowBlocks,About,Font,FontSize,Link,Unlink,Image,Flash,Table,Smiley,Iframe,Language,Indent,BulletedList,NumberedList,Outdent,Blockquote,CreateDiv,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock,BidiLtr,BidiRtl,HorizontalRule,SpecialChar,PageBreak,Styles,Format,BGColor,PasteText,CopyFormatting,Strike,Select,Scayt'
    };
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh');
    }, 500);

    this.user_id = this.userDoc['_id'];

    //for employee
    if(this.userDoc['candidate'].employee) {
      this.employee.value = this.userDoc['candidate'].employee;
      const locationArray = changeLocationDisplayFormat(this.employee.value.location);
      const newNoVisaPlaceArray = this.createLocationsListStrings(locationArray.noVisaArray);
      this.employee.noVisaArray = newNoVisaPlaceArray;

      let newVisaRequiredArray = this.createLocationsListStrings(locationArray.visaRequiredArray);
      this.employee.visaRequiredArray = newVisaRequiredArray;

      let rolesValue = [];
      for(let role of this.employee.value.roles){
        const filteredArray = getNameFromValue(this.roles,role);
        rolesValue.push(filteredArray.name);
      }
      this.employee.value.roles = rolesValue.sort();
      let availability = getNameFromValue(constants.workAvailability,this.employee.value.employment_availability);
      this.employee.value.employment_availability = availability.name;

      this.employee.annual_salary = this.employee.value.currency+' '+this.employee.value.expected_annual_salary;
    }

    //for contractor
    if(this.userDoc['candidate'].contractor) {
      this.contractor.value = this.userDoc['candidate'].contractor;
      const locationArray = changeLocationDisplayFormat(this.contractor.value.location);
      const newNoVisaPlaceArray = this.createLocationsListStrings(locationArray.noVisaArray);
      this.contractor.noVisaArray = newNoVisaPlaceArray;

      let newVisaRequiredArray = this.createLocationsListStrings(locationArray.visaRequiredArray);
      this.contractor.visaRequiredArray = newVisaRequiredArray;

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

      this.contractor.expected_hourly_rate = this.contractor.value.currency+' '+this.contractor.value.expected_hourly_rate;
    }

    //volunteer
    if(this.userDoc['candidate'].volunteer) {
      this.volunteer.value = this.userDoc['candidate'].volunteer;
      const locationArray = changeLocationDisplayFormat(this.volunteer.value.location);
      const newNoVisaPlaceArray = this.createLocationsListStrings(locationArray.noVisaArray);
      this.volunteer.noVisaArray = newNoVisaPlaceArray;

      let newVisaRequiredArray = this.createLocationsListStrings(locationArray.visaRequiredArray);
      this.volunteer.visaRequiredArray = newVisaRequiredArray;

      let rolesValue = [];
      for(let role of this.volunteer.value.roles){
        const filteredArray = getNameFromValue(this.roles,role);
        rolesValue.push(filteredArray.name);
      }
      this.volunteer.value.roles = rolesValue.sort();
    }

    this.interest_area = this.userDoc['candidate'].interest_areas;
    if(this.interest_area) this.interest_area.sort();

    if(this.viewBy === 'candidate' || this.viewBy === 'admin'){
      console.log(this.userDoc['candidate'].job_activity_status);
      if(this.userDoc['candidate'].job_activity_status) {
        this.job_activity_status = 1;

        if(this.userDoc['candidate'].job_activity_status.new_work_opportunities){
          let job_activity_obj = getNameFromValue(this.job_activities,this.userDoc['candidate'].job_activity_status.new_work_opportunities);
          this.new_work_opportunities = job_activity_obj.name;
        }
        if(this.userDoc['candidate'].job_activity_status.currently_employed) this.currently_employed = this.userDoc['candidate'].job_activity_status.currently_employed;
        if(this.userDoc['candidate'].job_activity_status.leaving_current_employ_reasons) {
          this.leaving_reasons = this.userDoc['candidate'].job_activity_status.leaving_current_employ_reasons;
          this.leaving_reasons = this.leaving_reasons.sort();
        }
        if(this.userDoc['candidate'].job_activity_status.other_reasons) this.other_reasons = this.userDoc['candidate'].job_activity_status.other_reasons;
        if(this.userDoc['candidate'].job_activity_status.counter_offer) this.counter_offer = this.userDoc['candidate'].job_activity_status.counter_offer;
      }
    }

    if(this.viewBy === 'candidate') {
      this.information.country = -1;
      this.routerUrl = '/users/talent/edit';
      if(!this.userDoc['candidate'].base_country && !this.userDoc['candidate'].base_city){
        $("#popModal_b").modal({
          show: true
        });
      }
      this.first_name = this.userDoc['first_name'];
      this.last_name = this.userDoc['last_name'];
      this.authenticationService.get_page_content('Candidate popup message')
      .subscribe(
        data => {
          if(data){
            this.candidateMsgTitle = data['page_title'];
            this.candidateMsgBody = data['page_content'];
          }
        }
      );
    }

    if(!this.anonimize)
      if(this.userDoc['image']) this.candidate_image = this.userDoc['image'];

    if(this.viewBy === 'admin') {
      this.is_verify = 'No';
      if(this.userDoc['is_verify'] === 1) this.is_verify = 'Yes';

      this.account_status = 'Yes';
      if(this.userDoc['disable_account'] === true) this.account_status = 'No';

      this.routerUrl = '/admins/talent/'+ this.user_id +'/edit';
      this.getTemplateOptions();
      if (this.userDoc['user_type'] === 'company') this.detail_link = '/admin-company-detail';
      if (this.userDoc['user_type'] === 'candidate') this.detail_link = '/admin-candidate-detail';

      if (this.userDoc['name']) {
        this.referred_name = this.userDoc['name'];
        this.referred_link = this.userDoc['user_id'];
      }
      else if (this.userDoc['referred_email']) this.referred_name = this.userDoc['referred_email'];

      this.candidateHistory = this.userDoc['candidate'].history;
    }

    if(this.viewBy === 'company'){
      if(this.userDoc['candidate'].job_activity_status) {
        this.cand_job_activity = this.userDoc['candidate'].job_activity_status.new_work_opportunities;
      }
      //checking already approached or not
      this.authenticationService.get_user_messages_comp(this.user_id)
      .subscribe(
        data => {
          if(data['messages'][0].message.approach) this.already_approached=1;
        },
        error => {
          if (error.message === 500 || error.message === 401) {
            localStorage.setItem('jwt_not_found', 'Jwt token not found');
            window.location.href = '/login';
          }
          if (error.message === 403) {}
        }
      );

      //getting last job offer desc
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
    }

    let commercial_platforms_check = 0,experimented_platforms_check = 0,commercial_skills_check=0;
    if(this.userDoc['candidate'] && this.userDoc['candidate'].blockchain) {
      if (this.userDoc['candidate'].blockchain.commercial_skills) {
        if(this.viewBy === 'admin' || this.viewBy === 'candidate') commercial_skills_check = 1;
        this.commercial_skills = this.userDoc['candidate'].blockchain.commercial_skills;
        this.commercial_skills.sort(function (a, b) {
          if (a.skill < b.skill) {
            return -1;
          }
          if (a.skill > b.skill) {
            return 1;
          }
          return 0;
        });

        let newCommercialsSkills = [];
        for (let commercialsSkills of this.commercial_skills) {
          let img = commercialsSkills.skill + ': ' + commercialsSkills.exp_year + ' years';
          newCommercialsSkills.push(img);
        }
        this.commercial_skills = newCommercialsSkills;
      }
      if(this.userDoc['candidate'].blockchain.description_commercial_skills) {
        this.description_commercial_skills = this.userDoc['candidate'].blockchain.description_commercial_skills;
        if(this.viewBy === 'admin' || this.viewBy === 'candidate') {
          commercial_skills_check = 0;
          if(this.description_commercial_skills.length > 100) commercial_skills_check = 1;
        }
      }

      if(this.userDoc['candidate'].blockchain.commercial_platforms){
        this.commercial = this.userDoc['candidate'].blockchain.commercial_platforms;
        if(this.commercial && this.commercial.length>0){
          if(this.viewBy === 'admin' || this.viewBy === 'candidate') commercial_platforms_check = 1;
          this.commercial.sort(function(a, b){
            if(a.platform_name < b.platform_name) { return -1; }
            if(a.platform_name > b.platform_name) { return 1; }
            return 0;
          });

          let newCommercials = [];
          for(let commercials of this.commercial){
            let img = '<img class="mb-1 ml-1" src = "/assets/images/all_icons/blockchain/'+commercials.name+'.png" alt="'+commercials.name+' Logo"> ' + commercials.name+': ' +commercials.exp_year +' years';
            newCommercials.push(img);
          }
          this.commercial = newCommercials;
        }
      }
      if(this.userDoc['candidate'].blockchain.description_commercial_platforms) {
        this.description_commercial_platforms = this.userDoc['candidate'].blockchain.description_commercial_platforms;
        if(this.viewBy === 'admin' || this.viewBy === 'candidate') {
          commercial_platforms_check = 0;
          if(this.description_commercial_platforms.length > 100) commercial_platforms_check = 1;
        }
      }

      if(this.userDoc['candidate'].blockchain.experimented_platforms){
        this.experimented = this.userDoc['candidate'].blockchain.experimented_platforms;
        if(this.experimented && this.experimented.length>0){
          if(this.viewBy === 'admin' || this.viewBy === 'candidate') experimented_platforms_check = 1;
          this.experimented.sort(function(a, b){
            if(a < b) { return -1; }
            if(a > b) { return 1; }
            return 0;
          });

          let newExperimented = [];
          for(let experimented of this.experimented){
            let img = '<img class="mb-1 ml-1" src = "/assets/images/all_icons/blockchain/'+experimented+'.png" alt="'+experimented+' Logo"> '+experimented;
            newExperimented.push(img);
          }
          this.experimented = newExperimented;
        }
      }

      if(this.userDoc['candidate'].blockchain.description_experimented_platforms) {
        this.description_experimented_platforms = this.userDoc['candidate'].blockchain.description_experimented_platforms;
        if(this.viewBy === 'admin' || this.viewBy === 'candidate') {
          experimented_platforms_check = 0;
          if(this.description_experimented_platforms.length > 100) experimented_platforms_check = 1;
        }
      }
    }

    if(this.viewBy === 'admin' || this.viewBy === 'candidate') {
      this.candidate_status = this.userDoc['candidate'].latest_status;
      this.created_date = this.userDoc['candidate'].history[this.userDoc['candidate'].history.length - 1].timestamp;

      this.linked_websites = 0;
      if(this.userDoc['candidate'].github_account) this.linked_websites++;
      if(this.userDoc['candidate'].stackexchange_account) this.linked_websites++;
      if(this.userDoc['candidate'].linkedin_account) this.linked_websites++;
      if(this.userDoc['candidate'].medium_account) this.linked_websites++;
      if(this.userDoc['candidate'].stackoverflow_url) this.linked_websites++;
      if(this.userDoc['candidate'].personal_website_url) this.linked_websites++;

      console.log(this.linked_websites);
      if(this.linked_websites>=2) {
        this.progress_bar_class = 'progress-bar bg-warning';
        this.progress_bar_value = 25;
      }

      if(this.userDoc['candidate'].work_history) {
        for(let workHistory of this.userDoc['candidate'].work_history){
          this.work_history_progress = 0;
          if(workHistory.description.length > 100){
            this.work_history_progress = 1;
            if(this.linked_websites>=2) {
              this.progress_bar_class = 'progress-bar bg-info';
              this.progress_bar_value = 50;
            }
            break;
          }
        }
      }

      console.log('WH: ' + this.work_history_progress);
      console.log('sites: ' + this.linked_websites);

      if (commercial_platforms_check && experimented_platforms_check && commercial_skills_check){
        if(this.linked_websites>=2 && this.work_history_progress === 1) {
          console.log('in all BC if');
          this.progress_bar_class = 'progress-bar bg-info';
          this.progress_bar_value = 75;
        }
      }

      if(this.userDoc['image'] != null ) {
        if(this.linked_websites>=2 && this.work_history_progress && (commercial_platforms_check && experimented_platforms_check && commercial_skills_check)) {
          this.progress_bar_class = 'progress-bar bg-success';
          this.progress_bar_value = 100;
        }
      }
    }

    this.languages = this.userDoc['candidate'].programming_languages;
    if(this.languages && this.languages.length>0){
      this.languages.sort(function(a, b){
        if(a.language < b.language) { return -1; }
        if(a.language > b.language) { return 1; }
        return 0;
      });

      let newLanguages = [];
      for(let languages of this.languages){
        let img = languages.language+': ' +languages.exp_year +' years';
        newLanguages.push(img);
      }
      this.languages = newLanguages;
    }

    this.work_history = this.userDoc['candidate'].work_history;
    this.work_history.sort(this.date_sort_desc);

    if(this.userDoc['candidate'].education_history) {
      this.education_history = this.userDoc['candidate'].education_history;
      this.education_history.sort(this.education_sort_desc);
    }
  }

  addNoteChange(event){
    if(event.target.name === 'add_note' && event.target.checked === false){
      this.note_template = '';
      this.note = '';
    }

    if(event.target.name === 'send_email' && event.target.checked === false){
      this.email_template = '';
      this.email_text = '';
      this.email_subject = 'Welcome to workonblockchain.com - your account has been approved!';
    }
  }

  changeStatus(){
    if(this.set_status === 'Rejected' || this.set_status === 'rejected'){
      $("#sel1-reason-deferred").css('display', 'none');
      $("#sel1-reason-rejected").css('display', 'block');
    }
    if(this.set_status === 'Deferred' || this.set_status === 'deferred'){
      $("#sel1-reason-rejected").css('display', 'none');
      $("#sel1-reason-deferred").css('display', 'block');
    }
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh');
    }, 200);
    this.status_error = '';
    this.error = '';
  }

  refreshSelect(){
    setTimeout(() => {
      $('.selectpicker').selectpicker();
    }, 200);
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

  selectTemplate(event,name){
    if(this.viewBy === 'admin') {
      let template = this.templateDoc.find(x => x.name === event.target.value);
      if (name === 'note') {
        this.note = template.body;
      }
      else {
        if ('subject' in template) this.email_subject = template.subject;
        this.email_text = template.body;
      }
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh');
      }, 200);
    }
  }

  is_approved;
  approveClick(approveForm: NgForm) {
    if(this.viewBy === 'admin') {
      this.error = '';
      this.success = '';
      if (!this.set_status && !this.note && !this.send_email) {
        this.error = 'Please fill at least one field';
      }

      else {
        if (this.set_status === "Rejected" || this.set_status === "rejected") {
          if (this.status_reason_rejected) {
            approveForm.value.set_status = this.set_status;
            approveForm.value.status_reason_rejected = this.status_reason_rejected;
            this.saveApproveData(approveForm.value);
          }
          else {
            this.status_error = 'Please select a reason';
            this.error = 'One or more fields need to be completed. Please scroll up to see which ones.';
          }
        }
        else if (this.set_status === "Deferred" || this.set_status === "deferred") {
          if (this.status_reason_deferred) {
            approveForm.value.set_status = this.set_status;
            approveForm.value.status_reason_deferred = this.status_reason_deferred;
            this.saveApproveData(approveForm.value);
          }
          else {
            this.status_error = 'Please select a reason';
            this.error = 'One or more fields need to be completed. Please scroll up to see which ones.';
          }
        }
        else if (this.send_email && this.email_text && !this.email_subject) {
          this.error = 'Please enter email subject too.';

        }

        else if (this.send_email && !this.email_text && this.email_subject) {
          this.error = 'Please enter email body too.';

        }
        else {
          if(this.email_text){
            approveForm.value.email_subject = this.email_subject;
            approveForm.value.email_text = this.email_text;
          }

          approveForm.value.note = this.note;
          approveForm.value.set_status = this.set_status;
          this.saveApproveData(approveForm.value);
          this.reset();
          approveForm.resetForm();
        }
      }
    }
  }

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


    this.authenticationService.candidate_status_history(this.user_id, queryInput, true)
      .subscribe(
        data => {
          this.candidateHistory = data['candidate'].history;
          this.user_id = data['_id'];
          let statusCount = 0;
          for(let history of this.candidateHistory) {
            if(statusCount === 0 && history.status) {
              this.candidate_status = history.status;
              statusCount = 1;
            }
          }
          this.reset();
          this.email_subject = 'Welcome to workonblockchain.com - your account has been approved!';
          $('.selectpicker').val('default');
          $('.selectpicker').selectpicker('refresh');
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
    this.email_template = '';
    this.note_template = '';
  }

  send_job_offer(msgForm: NgForm) {
    if(this.viewBy === 'company') {
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
        if (this.employee.min_salary && !this.checkNumber(this.employee.min_salary)) {
          this.salary_log = 'Salary should be a number';
          errorCount = 1;
        }
        if (this.employee.max_salary && !this.checkNumber(this.employee.max_salary)) {
          this.max_salary_log = 'Salary should be a number';
          errorCount = 1;
        }

        if (Number(this.employee.max_salary) < Number(this.employee.min_salary)) {
          errorCount = 1;
        }

        if (!this.employee.currency || this.employee.currency === 'Currency') {
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

        if (this.contractor.hourly_rate_min && !this.checkNumber(this.contractor.hourly_rate_min)) {
          this.hourly_rate_log = 'Salary should be a number';
          errorCount = 1;
        }
        if (this.contractor.hourly_rate_max && !this.checkNumber(this.contractor.hourly_rate_max)) {
          this.max_hourly_rate_log = 'Salary should be a number';
          errorCount = 1;
        }
        if (Number(this.contractor.hourly_rate_min) > Number(this.contractor.hourly_rate_max)) {
          errorCount = 1;
        }
        if (!this.contractor.currency || this.contractor.currency === 'Currency') {
          this.hourly_currency_log = 'Please select currency';
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

      if (!this.approach_work_type) {
        this.work_log = "Please select work type";
        errorCount = 1;
      }
      if (errorCount === 0) {
        let job_offer: any = {};
        let new_offer: any = {};
        if (this.approach_work_type === 'employee') {
          let salary: any = {};
          job_offer.job_title = this.employee.job_title;
          salary.min = Number(this.employee.min_salary);
          if (this.employee.max_salary) salary.max = Number(this.employee.max_salary);
          job_offer.annual_salary = salary;
          job_offer.currency = this.employee.currency;
          job_offer.employment_type = this.employee.job_type;
          job_offer.location = this.employee.location;
          job_offer.employment_description = this.employee.job_desc;
          new_offer.approach = {
            employee: job_offer
          }
        }
        if (this.approach_work_type === 'contractor') {
          let hourly_rate: any = {};
          job_offer.location = this.contractor.location;
          hourly_rate.min = Number(this.contractor.hourly_rate_min);
          if (this.contractor.hourly_rate_max) hourly_rate.max = Number(this.contractor.hourly_rate_max);
          job_offer.hourly_rate = hourly_rate;
          job_offer.currency = this.contractor.currency;
          job_offer.contract_description = this.contractor.contract_description;
          new_offer.approach = {
            contractor: job_offer
          }
        }

        if (this.approach_work_type === 'volunteer') {
          job_offer.location = this.volunteer.location;
          job_offer.opportunity_description = this.volunteer.opportunity_description;
          new_offer.approach = {
            volunteer: job_offer
          }
        }
        this.authenticationService.send_message(this.user_id, 'approach', new_offer)
          .subscribe(
            data => {
              this.job_offer_msg_success = 'Message successfully sent';
              this.employee = {};
              $("#approachModal").modal("hide");
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
      else {
        this.job_offer_log_erorr = 'One or more fields need to be completed. Please scroll up to see which ones.';
      }
    }
    else {
      //window.location.href = '/login';
    }
  }

  checkNumber(salary) {
    return /^[0-9]*$/.test(salary);
  }

  convertNumber(string) {
    return Number(string);
  }

  changeWorkTypes(){
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh');
    }, 300);
  }

  about() {
    if(this.information.country === -1) this.country_log ="Please choose base country";
    if(!this.information.city) this.city_log ="Please enter base city";
    if(this.information.country !== -1 && this.information.city) {
      let queryBody : any = {};
      let candidateBody : any = {};
      candidateBody.base_country = this.information.country;
      candidateBody.base_city = this.information.city;
      queryBody.candidate = candidateBody;

      this.authenticationService.edit_candidate_profile(this.user_id,queryBody,false)
      .subscribe(
        data => {
          if(data){
            this.userDoc['candidate'].base_country = this.information.country;
            this.userDoc['candidate'].base_city = this.information.city;
            $('#popModal_b').modal('hide');
          }
        },
        error => {
          if(error.message === 500 || error.message === 401) {
            localStorage.setItem('jwt_not_found', 'Jwt token not found');
            window.location.href = '/login';
          }
          if(error.message === 403) {}
        }
      );
    }
  }

  createLocationsListStrings(locationArray){
    let placesArray = [];

    for (let noVisaPlace of locationArray) {
      if (noVisaPlace.name === 'Remote') {
        let remote = '<i class="fas fa-laptop"></i> ' + noVisaPlace.name;
        placesArray.push(remote);
      }
      if (noVisaPlace.type === 'city') {
        let city = '<i class="fas fa-city"></i> ' + noVisaPlace.name;
        placesArray.push(city);
      }
      if (noVisaPlace.type === 'country') {
        let country = '<i class="fas fa-flag"></i> ' + noVisaPlace.name;
        placesArray.push(country);
      }
    }
    return placesArray;
  }

  sendEmailValue(event){
    this.send_email = false;
    if(event.target.checked){
      this.send_email = true;
    }
    console.log(event.target.checked);
    console.log(event.target.value);
    let strr = JSON.stringify(this.send_email);
    console.log('send_email: ' + strr);
    console.log(typeof strr);
  }

  addNoteValue(event){
    this.add_note = false;
    if(event.target.checked){
      this.add_note = true;
    }
    console.log(event.target.checked);
    console.log(event.target.value);
    let strr = JSON.stringify(this.add_note);
    console.log('add_note: ' + strr);
    console.log(typeof strr);
  }

  candidateCityValidation(){
    if(!this.information.city) {
      this.city_log = 'Please enter base city';
      return false;
    }
    delete this.city_log;
    return true;
  }

  candidateLocationValidate(){
    if(!this.information.country) {
      this.country_log = 'Please choose base country';
      return false;
    }
    delete this.country_log;
    return true;
  }

  volunteerLocationValidation(){
    if(!this.volunteer.location) {
      this.volunteer_location_log = 'Please enter location';
      return false;
    }
    delete this.volunteer_location_log;
    return true;
  }

  contractorLocationValidation(){
    if(!this.contractor.location) {
      this.contractor_location_log = 'Please enter location';
      return false;
    }
    delete this.contractor_location_log;
    return true;
  }

  contractorCurrencyValidate(){
    if (!this.contractor.currency || this.contractor.currency === 'Currency') {
      this.hourly_currency_log = 'Please select currency';
      return false;
    }
    delete this.hourly_currency_log;
    return true
  }

  employeeCurrencyValidate(){
    if (!this.employee.currency || this.employee.currency === 'Currency') {
      this.salary_currency_log = 'Please select currency';
      return false;
    }
    delete this.salary_currency_log;
    return true
  }

  employeeLocationValidation(){
    if(!this.employee.location) {
      this.location_log = 'Please enter location';
      return false;
    }
    delete this.location_log;
    return true;
  }

  jobTitleValidation(){
    if(!this.employee.job_title) {
      this.job_title_log = 'Please enter job title';
      return false;
    }
    delete this.job_title_log;
    return true
  }

}
