import { Component, OnInit, Input, Inject, PLATFORM_ID } from '@angular/core';
import {isPlatformBrowser} from "@angular/common";

import {constants} from '../../../constants/constants';
declare var $:any;

@Component({
  selector: 'app-p-add-job',
  templateUrl: './add-job.component.html',
  styleUrls: ['./add-job.component.css']
})
export class AddJobComponent implements OnInit {
  @Input() userDoc: object;
  @Input() viewBy: string; // "admin", "company"

  email_notificaiton = constants.email_notificaiton;
  when_receive_email_notitfications;job_name;job_status;
  job_status_options = constants.job_status;jobStatusErrMsg;
  jobNameErrMsg;error_msg;workTypes = constants.workTypes;
  work_type;work_type_log;employeeCheck = false;selected_work_type=[];
  contractorCheck = false;volunteerCheck = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    console.log('add job page');
    this.when_receive_email_notitfications = this.userDoc['when_receive_email_notitfications'];
  }

  addJob(){
    let errorCount = 0;
    this.error_msg = "";
    if(!this.job_name){
      errorCount = 1;
      this.jobNameErrMsg = "Please enter job name";
    }
    if(!this.job_status){
      errorCount = 1;
      this.jobStatusErrMsg = "Please select job status";
    }
    if(this.employeeCheck === false && this.contractorCheck === false && this.volunteerCheck === false) {
      this.work_type_log = "Please select work type";
      errorCount = 1;
    }

    if(errorCount === 0) {
      console.log(this.work_type);
      console.log('add job ftn');
    }
    else this.error_msg = "One or more fields need to be completed. Please scroll up to see which ones.";
  }

  workTypeChange(event) {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh');
      }, 300);
    }
    if(event.target.checked) this.selected_work_type.push(event.target.value);
    else {
      let updateItem = this.selected_work_type.find(x => x === event.target.value);
      let index = this.selected_work_type.indexOf(updateItem);
      this.selected_work_type.splice(index, 1);
    }

    if(this.selected_work_type.indexOf('employee') > -1) this.employeeCheck = true;
    else this.employeeCheck = false;
    if(this.selected_work_type.indexOf('contractor') > -1) this.contractorCheck = true;
    else this.contractorCheck = false;
    if(this.selected_work_type.indexOf('volunteer') > -1) this.volunteerCheck = true;
    else this.volunteerCheck = false;
  }

}
