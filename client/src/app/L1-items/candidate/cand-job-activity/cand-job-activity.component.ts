import {Component, OnInit, Input} from '@angular/core';
import { constants } from '../../../../constants/constants';

@Component({
  selector: 'app-i-forme-cand-job-activity',
  templateUrl: './cand-job-activity.component.html',
  styleUrls: ['./cand-job-activity.component.css']
})
export class CandJobActivityComponent implements OnInit {
  @Input() jobActivity: string;
  @Input() currentEmploy: string;
  @Input() reasonsOfLeaving: Array<string>;
  @Input() otherReasons: string;
  @Input() counterOffer: string;

  job_activity_status = constants.job_activity_status;
  radio_buttons = constants.radio_buttons;
  reasons_of_leaving = constants.reasons_of_leaving;
  errMsg;
  currentEmployerrMsg;
  leavingReasons = [];
  errMsgLeavingReasons;
  errMsgOtherReasons;
  other_reasons_text_box = 0;
  counterOfferErrMsg;

  constructor() { }

  ngOnInit() {
    if(this.otherReasons) this.other_reasons_text_box = 1;
  }

  selfValidate() {
    if(!this.jobActivity){
      this.errMsg = "Please select current job activity status";
      return false;
    }
    this.errMsg = '';
    return true;
  }

  onChange(event){
    this.jobActivity = event.target.value;
    this.errMsg = '';
  }

  currentEmploymentValidate(){
    if(this.jobActivity && this.jobActivity !== 'Not now'){
      if(!this.currentEmploy){
        this.currentEmployerrMsg = "Please select current employment";
        return false;
      }
      this.currentEmployerrMsg = '';
      return true;
    }
  }

  selectEmployment(event){
    this.currentEmploy = event.target.value;
    this.currentEmployerrMsg = '';
  }

  selectCounterOffer(event){
    this.counterOffer = event.target.value;
    this.counterOfferErrMsg = '';
  }

  validateCounterOffer(){
    if(this.jobActivity && this.jobActivity !== 'Not now'){
      if(!this.counterOffer){
        this.counterOfferErrMsg = "Please select yes or no";
        return false;
      }
      this.counterOfferErrMsg = '';
      return true;
    }
  }

  validateReasons(){
    if(!this.reasonsOfLeaving) {
      this.errMsgLeavingReasons = 'Please select atleast one reason';
      return false;
    }
    if(this.reasonsOfLeaving && this.reasonsOfLeaving.length <= 0) {
      this.errMsgLeavingReasons = 'Please select atleast one reason';
      return false;
    }

    this.other_reasons_text_box = 0;
    if(this.reasonsOfLeaving.find((obj => obj === 'Other')))
      this.other_reasons_text_box = 1;
    else this.otherReasons = '';

    delete this.errMsgLeavingReasons;
    return true;
  }

  selfValidateOtherReasons() {
    if (!this.otherReasons) {
      this.errMsgOtherReasons = 'Please enter other reasons';
      return false;
    }
    delete this.errMsgOtherReasons;
    return true;
  }

}
