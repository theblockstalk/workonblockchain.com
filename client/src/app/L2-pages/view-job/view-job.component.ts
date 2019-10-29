import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import {getNameFromValue, makeImgCode, makeIconCode} from '../../../services/object';
import {constants} from '../../../constants/constants';

@Component({
  selector: 'app-p-view-job',
  templateUrl: './view-job.component.html',
  styleUrls: ['./view-job.component.css']
})
export class ViewJobComponent implements OnInit, AfterViewInit {
  @Input() jobDoc: object;
  @Input() viewBy: string; // "admin", "company", "candidate"

  salary;selectedValueArray = [];countries = [];
  mappedPositions = [];jobName;

  constructor() { }

  ngOnInit() {
    console.log('on page level');
    if(this.jobDoc['expected_salary_min']) {
      this.salary = this.jobDoc['currency'] + ' ' + this.jobDoc['expected_salary_min'] + ' per year';
      if(this.jobDoc['expected_salary_max'])
        this.salary = this.jobDoc['currency'] + ' ' + this.jobDoc['expected_salary_min'] + '-' + this.jobDoc['expected_salary_max'] + ' per year';
    }

    if(this.jobDoc['expected_hourly_rate_min']) {
      this.salary = this.jobDoc['currency'] + ' ' + this.jobDoc['expected_hourly_rate_min'] + ' per year';
      if(this.jobDoc['expected_hourly_rate_max'])
        this.salary = this.jobDoc['currency'] + ' ' + this.jobDoc['expected_hourly_rate_min'] + '-' + this.jobDoc['expected_hourly_rate_max'] + ' per year';
    }

    for(let role of this.jobDoc['positions']){
      const filteredArray = getNameFromValue(constants.workRoles,role);
      this.mappedPositions.push(filteredArray.name);
    }
    if(this.jobDoc['work_type'] === 'volunteer')
      this.jobName = this.jobDoc['name']+' temporary volunteer';
    if(this.jobDoc['work_type'] === 'employee')
      this.jobName = this.jobDoc['name']+' '+this.jobDoc['job_type'][0];
    if(this.jobDoc['work_type'] === 'contractor')
      this.jobName = this.jobDoc['name']+' contractor';
  }

  createBlockchainLogos(commercial){
    let newCommercials = [];
    for(let commercials of commercial){
      let img;
      if(commercials['type'] === 'blockchain')
        img = makeImgCode(commercials) + ' ' + commercials['name'];

      if(commercials['type'] === 'language')
        img = makeIconCode('fas fa-code') + commercials.name;

      if(commercials.type === 'experience')
        img = makeIconCode('fas fa-user-friends') + commercials.name;
      
      if(commercials.exp_year) img = img +'&nbsp; &nbsp; min ' +commercials.exp_year +'+ years exp';
      newCommercials.push(img);
    }
    return newCommercials;
  }

  filter_array(arr) {
    var hashTable = {};
    return arr.filter(function (el) {
      var key = JSON.stringify(el);
      var match = Boolean(hashTable[key]);
      return (match ? false : hashTable[key] = true);
    });
  }

  getLink(user, jobId, companyId){
    if(user === 'company') return '/users/company/jobs/'+jobId+'/edit';
    if(user === 'admin') return '/admins/company/'+companyId+'/jobs/'+jobId+'/edit';
  }

  ngAfterViewInit(): void {
    window.scrollTo(0, 0);
  }

}
