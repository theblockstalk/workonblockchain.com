import { Component, OnInit, Input } from '@angular/core';
import {constants} from '../../../../constants/constants';

@Component({
  selector: 'app-i-forme-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {
  @Input() country: string;
  countries = constants.countries;
  errMsg;
  constructor() { }

  ngOnInit() {
  }

  selfValidate() {
    if(!this.country) {
      this.errMsg = "Please select country";
      return false;
    }
    delete this.errMsg;
    return true;
  }

}
