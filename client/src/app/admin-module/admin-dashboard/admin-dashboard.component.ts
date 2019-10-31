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
  reviewed_candidates;deferred_candidates;pricePlanChanged = [];
  pricePlans;candidate_status_wizard_completed;candidate_status_reviewed;
  candidate_status_deferred;

  constructor(private router: Router,private authenticationService: UserService, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    // this.routerUrl = '/admins/talent/'+ this.user_id +'/edit';
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh');
      }, 300);
    }
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
    this.search(this.timeframe);
  }

  search(event){
    this.number_of_days = event;

    //getting companies last msg sent/received for the last said days
    let companyQueryBody : any = {};
    if(this.number_of_days) companyQueryBody.last_msg_received_day = this.number_of_days;
    this.getCompaniesInfo(companyQueryBody);

    //getting newly created companies for the last said days
    let companyQuery : any = {};
    if(this.number_of_days) companyQuery.created_after = this.number_of_days;
    this.getCompaniesInfo(companyQuery);

    //getting companies which changed their price plan
    let companyPricePlanQuery : any = {};
    if(this.number_of_days) companyPricePlanQuery.pricing_plan_changed_after = this.number_of_days;
    this.getCompaniesInfo(companyPricePlanQuery);

    //getting newly created candidates for the last said days
    this.candidateStatus('wizard completed');
    this.candidateStatus('reviewed');
    this.candidateStatus('deferred');
  }

  getCompaniesInfo(companyQueryBody : any = {}){
    this.companiesSendReceivermsgs = '';
    this.newlyCreatedCompanies = '';
    this.pricePlanChanged = [];

    this.authenticationService.admin_company_filter(companyQueryBody)
      .subscribe(
        data =>
        {
          if(companyQueryBody.pricing_plan_changed_after){
            this.pricePlans = data;
            for(let comp of this.pricePlans){
              if(comp['history'].length > 0){
                for(let history of comp['history']){
                  if(history['pricing_plan']){
                    let pricePlanObj = {
                      id: comp['_creator'],
                      company_name: comp['company_name'],
                      pricing_plan: history['pricing_plan']
                    };
                    this.pricePlanChanged.push(pricePlanObj);
                    break;
                  }
                }
              }
            }
          }
          if(companyQueryBody.last_msg_received_day) this.companiesSendReceivermsgs = data;
          if(companyQueryBody.created_after) this.newlyCreatedCompanies = data;
        },
        error =>
        {
          //console.log('error');
        }
      );
  }

  candidateStatus(status){
    let candQueryBody : any = {};
    candQueryBody.status = status;
    candQueryBody.status_last_updated_day = this.number_of_days;

    this.wizard_completed_candidates = '';
    this.reviewed_candidates = '';
    this.deferred_candidates = '';
    this.authenticationService.admin_candidate_filter(candQueryBody)
      .subscribe(
        data =>
        {
          if(status === 'wizard completed') {
            this.candidate_status_wizard_completed = status;
            this.wizard_completed_candidates = data;
          }
          if(status === 'reviewed') {
            this.candidate_status_reviewed = status;
            this.reviewed_candidates = data;
          }
          if(status === 'deferred') {
            this.candidate_status_deferred = status;
            this.deferred_candidates = data;
          }
        },
        error =>
        {
          //console.log('error');
        }
      );
  }

}
