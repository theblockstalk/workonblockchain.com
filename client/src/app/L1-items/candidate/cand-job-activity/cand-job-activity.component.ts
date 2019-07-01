import {Component, OnInit, Input} from '@angular/core';
import { constants } from '../../../../constants/constants';

@Component({
  selector: 'app-i-forme-cand-job-activity',
  templateUrl: './cand-job-activity.component.html',
  styleUrls: ['./cand-job-activity.component.css']
})
export class CandJobActivityComponent implements OnInit {
  @Input() jobActivity: string;

  job_activity_status = constants.job_activity_status;
  job_activity_status_value;
  errMsg;

  constructor() { }

  ngOnInit() {
    if(this.jobActivity) {
      console.log(this.jobActivity);
      this.job_activity_status_value = this.jobActivity;
    }
  }

  selfValidate() {
    console.log('in self valid');
    if(!this.job_activity_status_value){
      this.errMsg = "Please select current job activity status in comp";
      return false;
    }
    this.errMsg = '';
    return true;
  }

  onChange(event){
    console.log(event.target.defaultValue);
    this.job_activity_status_value = event.target.defaultValue;
    this.errMsg = '';
  }

}
