import { Component, OnInit , AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
declare var $:any;
import {constants} from '../../../constants/constants';
import {isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit, AfterViewInit {

  constructor(private router: Router, private authenticationService: UserService,@Inject(PLATFORM_ID) private platformId: Object) {
  }

  email_notificaiton = constants.email_notificaiton;currentUser: User;
  when_receive_email_notitfications;pricing_disable;gdpr_disable;
  about_active_class;terms_active_class;pref_active_class;
  price_plan_active_class;gdpr_compliance_active_class;myJobs;
  jobsAdded = 0;errors;email_notification_log;log;

  ngOnInit() {
    this.pricing_disable = "disabled";
    $('.selectpicker').selectpicker('refresh');
    this.gdpr_disable = 'disabled';
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(!this.currentUser) {
      this.router.navigate(['/login']);
    }
    else if(this.currentUser && this.currentUser.type === 'company') {
      this.authenticationService.getCurrentCompany(this.currentUser._id, false)
        .subscribe(
          data =>
          {
            console.log(data);
            if(data['terms_id'])
            {
              this.terms_active_class = 'fa fa-check-circle text-success';
            }
            if(data['company_founded'] && data['no_of_employees'] && data['company_funded'] && data['company_description'])
            {
              this.about_active_class = 'fa fa-check-circle text-success';
            }

            this.when_receive_email_notitfications = data['when_receive_email_notitfications'];

            if(data['job_ids'] && data['job_ids'].length > 0) {
              this.jobsAdded = 1;
              this.pref_active_class = 'fa fa-check-circle text-success';
              setTimeout(() => {
                $('.selectpicker').selectpicker();
                $('.selectpicker').selectpicker('refresh');
              }, 500);
              this.myJobs = data['job_ids'];
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
    }
    else this.router.navigate(['/not_found']);
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

  getClass(value){
    if(value === 'open') return 'text-success';
    if(value === 'closed') return 'text-danger';
    else return 'text-warning';
  }

  jobPreferences(){
    this.errors = '';
    let errorCount = 0;
    if(!this.when_receive_email_notitfications) {
      this.email_notification_log = "Please select when you want to receive email notification";
      errorCount = 1;
    }

    if(errorCount === 0) {
      console.log('send in db');
      console.log(this.when_receive_email_notitfications);
      console.log('this.jobsAdded : ' + this.jobsAdded);
      let inputQuery : any ={};
      inputQuery.when_receive_email_notitfications = this.when_receive_email_notitfications;
      this.authenticationService.edit_company_profile(this.currentUser['_id'], inputQuery, false)
        .subscribe(
          data =>{
            if(data) {
              if (this.jobsAdded) this.router.navigate(['/users/company/wizard/pricing']);
              else this.router.navigate(['/users/company/jobs/new']);
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
            else this.log = "Something went wrong";
          }
        )
    }
    else this.errors = 'One or more fields need to be completed.';
  }

}
