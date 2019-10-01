import { Component, OnInit } from '@angular/core';
import {UserService} from '../../user.service';
import {constants} from '../../../constants/constants';
import {getDateFromDays} from '../../../services/object';

@Component({
  selector: 'app-admin-timeframe-search',
  templateUrl: './admin-timeframe-search.component.html',
  styleUrls: ['./admin-timeframe-search.component.css']
})
export class AdminTimeframeSearchComponent implements OnInit {

  timeframe_list = constants.timeframe_list;
  timeframe = 5;timeframe_log;number_of_days;
  candidateSendReceivermsgs;companiesSendReceivermsgs;
  newlyCreatedCompanies;

  constructor(private authenticationService: UserService) { }

  ngOnInit() {
    console.log('in AdminTimeframeSearchComponent');
    this.search(10);
  }
  selected_timeframe(){
    console.log('changed');
    console.log(this.timeframe);
  }

  search(event){
    let queryBody : any = {};
    this.number_of_days = event;

    if(this.number_of_days) queryBody.last_msg_received_day = getDateFromDays(this.number_of_days);

    //getting candidates last msg sent/received
    this.authenticationService.admin_candidate_filter(queryBody)
    .subscribe(
      data =>
      {
        this.candidateSendReceivermsgs = data;
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

    //getting companies last msg sent/received
    let companyQueryBody : any = {};
    if(this.number_of_days) companyQueryBody.last_msg_received_day = this.number_of_days;

    this.authenticationService.admin_company_filter(companyQueryBody)
    .subscribe(
      data =>
      {
        this.companiesSendReceivermsgs = data;
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

    //getting newly created companies for the last said days
    console.log(this.number_of_days);
    let companyCreatedQueryBody : any = {};
    if(this.number_of_days) companyCreatedQueryBody.created_after = this.number_of_days;

    this.authenticationService.admin_company_filter(companyCreatedQueryBody)
      .subscribe(
        data =>
        {
          this.newlyCreatedCompanies = data;
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

}
