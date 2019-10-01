import { Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import {UserService} from '../../user.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import {constants} from '../../../constants/constants';
declare var $:any;

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  currentUser: any;
  is_admin;
  user_type;
  admin_log;
  routerUrl;
  timeframe_list = constants.timeframe_list;
  timeframe = 5;timeframe_log;number_of_days;
  companiesSendReceivermsgs;newlyCreatedCompanies;wizard_completed_candidates;
  reviewed_candidates;deferred_candidates;

  constructor(private router: Router,private authenticationService: UserService, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    // this.routerUrl = '/admins/talent/'+ this.user_id +'/edit';
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh');
      }, 300);
    }
    console.log('in AdminTimeframeSearchComponent');
    this.search(this.timeframe); //default 5 days

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.admin_log = JSON.parse(localStorage.getItem('admin_log'));

    if(!this.currentUser)
    {
      this.router.navigate(['/login']);
    }

    if(this.currentUser && this.admin_log )
    {
      if(this.admin_log.is_admin === 1) {

      }
      else
        this.router.navigate(['/not_found']);
    }
    else
    {
      this.router.navigate(['/not_found']);
    }
  }

  selected_timeframe(){
    console.log('changed');
    console.log(this.timeframe);
    this.search(this.timeframe);
  }

  search(event){
    this.number_of_days = event;

    //getting companies last msg sent/received
    let companyQueryBody : any = {};
    if(this.number_of_days) companyQueryBody.last_msg_received_day = this.number_of_days;
    this.getCompaniesInfo(companyQueryBody);

    //getting newly created companies for the last said days
    let companyQuery : any = {};
    if(this.number_of_days) companyQuery.created_after = this.number_of_days;
    this.getCompaniesInfo(companyQuery);

    //getting newly created candidates
    this.candidateStatus('wizard completed');
    this.candidateStatus('reviewed');
    this.candidateStatus('deferred');
  }

  getCompaniesInfo(companyQueryBody : any = {}){
    console.log(companyQueryBody);
    this.companiesSendReceivermsgs = '';
    this.newlyCreatedCompanies = '';
    this.authenticationService.admin_company_filter(companyQueryBody)
      .subscribe(
        data =>
        {
          if(companyQueryBody.last_msg_received_day) this.companiesSendReceivermsgs = data;
          if(companyQueryBody.created_after) this.newlyCreatedCompanies = data;
        },
        error =>
        {
          if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
            /*this.response = "data";
            this.length = '';
            this.info = [];
            this.page = '';
            this.log = error['error']['message'];*/
          }
          else if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
            /*this.response = "data";
            this.length = '';
            this.info = [];
            this.page = '';
            this.log = error['error']['message'];*/
          }
          else {
            console.log('error');
            //this.log = "Something went wrong";
          }
        }
      );
  }

  candidateStatus(status){
    let candQueryBody : any = {};
    candQueryBody.status = status;
    candQueryBody.updatedAfter = this.number_of_days;

    this.wizard_completed_candidates = '';
    this.reviewed_candidates = '';
    this.deferred_candidates = '';
    this.authenticationService.admin_candidate_filter(candQueryBody)
      .subscribe(
        data =>
        {
          if(status === 'wizard completed') this.wizard_completed_candidates = data;
          if(status === 'reviewed') this.reviewed_candidates = data;
          if(status === 'deferred') this.deferred_candidates = data;
        },
        error =>
        {
          if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
            /*this.response = "data";
            this.length = '';
            this.info = [];
            this.page = '';
            this.log = error['error']['message'];*/
          }
          else if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
            /*this.response = "data";
            this.length = '';
            this.info = [];
            this.page = '';
            this.log = error['error']['message'];*/
          }
          else {
            //this.log = "Something went wrong";
            console.log('error');
          }
        }
      );
  }

}
