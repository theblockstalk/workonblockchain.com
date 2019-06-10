import { Component, OnInit, Input } from '@angular/core';
import {constants} from '../../../../constants/constants';

@Component({
  selector: 'app-i-forme-nationality',
  templateUrl: './nationality.component.html',
  styleUrls: ['./nationality.component.css']
})
export class NationalityComponent implements OnInit {
  @Input() nationality: Array<string>;
  nationalities = constants.nationalities;
  errMsg;
  constructor() { }

  ngOnInit() {
  }

  selfValidate() {
    if(!this.nationality) {
      this.errMsg = "Please select nationality";
      return false;
    }
    if(this.nationality) {
      if(this.nationality.length === 0) {
        this.errMsg = "Please select nationality";
        return false;
      }
      if(this.nationality.length > 4) {
        this.errMsg = "Please select maximum 4 nationalities";
        return false;
      }
    }
    delete this.errMsg;
    return true;
  }

}
