import { Component, OnInit, Input } from '@angular/core';
import { unCheckCheckboxes } from '../../../../services/object';
import {constants} from '../../../../constants/constants';

@Component({
  selector: 'app-i-forme-interests',
  templateUrl: './interests.component.html',
  styleUrls: ['./interests.component.css']
})
export class InterestsComponent implements OnInit {
  @Input() interest_areas = [];
  options = constants.workBlockchainInterests;
  errMsg;
  constructor() { }

  ngOnInit() {
    this.options = unCheckCheckboxes(this.options);

  }

  selfValidate() {
    if(!this.interest_areas) {
      this.errMsg = 'Please select atleast one interest';
      return false;
    }
    if(this.interest_areas && this.interest_areas.length <= 0) {
      this.errMsg = 'Please select atleast one interest';
      return false;
    }
    delete this.errMsg;
    return true;
  }


}
