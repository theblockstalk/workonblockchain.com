import { Component, OnInit, Input } from '@angular/core';
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

  //http://localhost:4200/admins/talent/5ced0aa45b3fda10fc2aef2b/view

  routerUrl;
  user_id;
  candidate_image;
  referred_name = '';
  referred_link;
  detail_link;
  candidate_status;
  created_date;
  candidateHistory;
  _id;
  set_status;
  status_reason_rejected;
  status_reason_deferred;
  set_candidate_status = constants.set_candidate_status;
  set_candidate_status_rejected = constants.statusReasons_rejected;
  set_candidate_status_deferred = constants.statusReasons_deferred;
  roles = constants.workRoles;
  contractorTypes = constants.contractorTypes;
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
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh');
    }, 500);

    this.user_id = this.userDoc['_id'];
    this._id  = this.user_id;

    //for employee
    if(this.userDoc['candidate'].employee) {
      this.employee.value = this.userDoc['candidate'].employee;
      const locationArray = changeLocationDisplayFormat(this.employee.value.location);
      let newNoVisaPlaceArray = [];
      for(let noVisaPlace of locationArray.noVisaArray){
        if(noVisaPlace.name === 'Remote'){
          let remote = '<i class="fas fa-laptop"></i> '+noVisaPlace.name;
          newNoVisaPlaceArray.push(remote);
        }
        if(noVisaPlace.type === 'city') {
          let city = '<i class="fas fa-city"></i> '+noVisaPlace.name;
          newNoVisaPlaceArray.push(city);
        }
        if(noVisaPlace.type === 'country') {
          let country = '<i class="fas fa-flag"></i> '+noVisaPlace.name;
          newNoVisaPlaceArray.push(country);
        }
      }
      this.employee.noVisaArray = newNoVisaPlaceArray;

      let newVisaRequiredArray = [];
      for(let visaPlace of locationArray.visaRequiredArray){
        if(visaPlace.type === 'city') {
          let city = '<i class="fas fa-city"></i> '+visaPlace.name;
          newVisaRequiredArray.push(city);
        }
        if(visaPlace.type === 'country') {
          let country = '<i class="fas fa-flag"></i> '+visaPlace.name;
          newVisaRequiredArray.push(country);
        }
      }
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
      let newNoVisaPlaceArray = [];
      for(let noVisaPlace of locationArray.noVisaArray){
        if(noVisaPlace.name === 'Remote'){
          let remote = '<i class="fas fa-laptop"></i> '+noVisaPlace.name;
          newNoVisaPlaceArray.push(remote);
        }
        if(noVisaPlace.type === 'city') {
          let city = '<i class="fas fa-city"></i> '+noVisaPlace.name;
          newNoVisaPlaceArray.push(city);
        }
        if(noVisaPlace.type === 'country') {
          let country = '<i class="fas fa-flag"></i> '+noVisaPlace.name;
          newNoVisaPlaceArray.push(country);
        }
      }
      this.contractor.noVisaArray = newNoVisaPlaceArray;

      let newVisaRequiredArray = [];
      for(let visaPlace of locationArray.visaRequiredArray){
        if(visaPlace.type === 'city') {
          let city = '<i class="fas fa-city"></i> '+visaPlace.name;
          newVisaRequiredArray.push(city);
        }
        if(visaPlace.type === 'country') {
          let country = '<i class="fas fa-flag"></i> '+visaPlace.name;
          newVisaRequiredArray.push(country);
        }
      }
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
      let newNoVisaPlaceArray = [];
      for(let noVisaPlace of locationArray.noVisaArray){
        if(noVisaPlace.name === 'Remote'){
          let remote = '<i class="fas fa-laptop"></i> '+noVisaPlace.name;
          newNoVisaPlaceArray.push(remote);
        }
        if(noVisaPlace.type === 'city') {
          let city = '<i class="fas fa-city"></i> '+noVisaPlace.name;
          newNoVisaPlaceArray.push(city);
        }
        if(noVisaPlace.type === 'country') {
          let country = '<i class="fas fa-flag"></i> '+noVisaPlace.name;
          newNoVisaPlaceArray.push(country);
        }
      }
      this.volunteer.noVisaArray = newNoVisaPlaceArray;
      console.log(this.volunteer.noVisaArray.length);

      let newVisaRequiredArray = [];
      for(let visaPlace of locationArray.visaRequiredArray){
        if(visaPlace.type === 'city') {
          let city = '<i class="fas fa-city"></i> '+visaPlace.name;
          newVisaRequiredArray.push(city);
        }
        if(visaPlace.type === 'country') {
          let country = '<i class="fas fa-flag"></i> '+visaPlace.name;
          newVisaRequiredArray.push(country);
        }
      }
      this.volunteer.visaRequiredArray = newVisaRequiredArray;
      let rolesValue = [];
      for(let role of this.volunteer.value.roles){
        const filteredArray = getNameFromValue(this.roles,role);
        rolesValue.push(filteredArray.name);
      }
      this.volunteer.value.roles = rolesValue.sort();
    }

    this.interest_area =this.userDoc['candidate'].interest_areas;
    if(this.interest_area) this.interest_area.sort();

    if(this.viewBy === 'candidate') this.routerUrl = '/users/talent/edit';

    if(this.userDoc['image']) this.candidate_image = this.userDoc['image'];

    if(this.viewBy === 'admin') {
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

        this.work_history = this.userDoc['candidate'].work_history;
        this.work_history.sort(this.date_sort_desc);
      }

      let commercial_platforms_check = 0,experimented_platforms_check = 0,commercial_skills_check=0;
      if(this.userDoc['candidate'] && this.userDoc['candidate'].blockchain) {
        if(this.userDoc['candidate'].blockchain.commercial_skills) {
          commercial_skills_check = 1;
          this.commercial_skills = this.userDoc['candidate'].blockchain.commercial_skills;
          this.commercial_skills.sort(function(a, b){
            if(a.skill < b.skill) { return -1; }
            if(a.skill > b.skill) { return 1; }
            return 0;
          });

          let newCommercialsSkills = [];
          for(let commercialsSkills of this.commercial_skills){
            let img = commercialsSkills.skill+': ' +commercialsSkills.exp_year +' years';
            newCommercialsSkills.push(img);
          }
          this.commercial_skills = newCommercialsSkills;
        }

        if(this.userDoc['candidate'].blockchain.commercial_platforms){
          this.commercial = this.userDoc['candidate'].blockchain.commercial_platforms;
          if(this.commercial && this.commercial.length>0){
            commercial_platforms_check = 1;
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

        if(this.userDoc['candidate'].blockchain.experimented_platforms){
          this.experimented = this.userDoc['candidate'].blockchain.experimented_platforms;
          if(this.experimented && this.experimented.length>0){
            experimented_platforms_check = 1;
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

        if(this.userDoc['candidate'].blockchain.description_commercial_platforms) {
          this.description_commercial_platforms = this.userDoc['candidate'].blockchain.description_commercial_platforms;
          commercial_platforms_check = 0;
          if(this.description_commercial_platforms.length > 100) commercial_platforms_check = 1;
        }

        if(this.userDoc['candidate'].blockchain.description_experimented_platforms) {
          this.description_experimented_platforms = this.userDoc['candidate'].blockchain.description_experimented_platforms;
          experimented_platforms_check = 0;
          if(this.description_experimented_platforms.length > 100) experimented_platforms_check = 1;
        }

        if(this.userDoc['candidate'].blockchain.description_commercial_skills) {
          this.description_commercial_skills = this.userDoc['candidate'].blockchain.description_commercial_skills;
          commercial_skills_check = 0;
          if(this.description_commercial_skills.length > 100) commercial_skills_check = 1;
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

      if(this.userDoc['image'] != null ) {
        if(this.linked_websites>=2 && this.work_history_progress && (commercial_platforms_check && experimented_platforms_check && commercial_skills_check)) {
          this.progress_bar_class = 'progress-bar bg-success';
          this.progress_bar_value = 100;
        }
      }
    }
  }

  changeStatus(event){
    if(event === 'Rejected' || event === 'rejected'){
      $("#sel1-reason-deferred").css('display', 'none');
      $("#sel1-reason-rejected").css('display', 'block');
    }
    if(event === 'Deferred' || event === 'deferred'){
      $("#sel1-reason-rejected").css('display', 'none');
      $("#sel1-reason-deferred").css('display', 'block');
    }
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh');
    }, 200);
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

  selectTemplate(event, name){
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
      if (!approveForm.value.set_status && !approveForm.value.note && !approveForm.value.send_email) {
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
        else if (approveForm.value.send_email && approveForm.value.email_text && !approveForm.value.email_subject) {
          this.error = 'Please enter email subject too.';

        }

        else if (approveForm.value.send_email && !approveForm.value.email_text && approveForm.value.email_subject) {
          this.error = 'Please enter email body too.';

        }
        else {
          this.saveApproveData(approveForm.value);
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
  }

}
