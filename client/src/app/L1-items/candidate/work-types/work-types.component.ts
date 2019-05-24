import { Component, OnInit, Input } from '@angular/core';
import {constants} from '../../../../constants/constants';

@Component({
  selector: 'app-i-forme-work-types',
  templateUrl: './work-types.component.html',
  styleUrls: ['./work-types.component.css']
})
export class WorkTypesComponent implements OnInit {
  @Input() work_types;
  options = constants.work_types;
  selectedWorkType = [];
  errMsg;

  constructor() { }

  ngOnInit() {
    this.selectedWorkType = this.work_types;
    console.log(this.work_types);
  }

  selfValidate() {
    if(this.selectedWorkType && this.selectedWorkType.length <= 0) {
      this.errMsg = 'Please select atleast one work type';
      return false;
    }
    delete this.errMsg;
    return true;
  }

  workTypesChange(value) {
    console.log(value);
    this.selectedWorkType = value;

  }

}
