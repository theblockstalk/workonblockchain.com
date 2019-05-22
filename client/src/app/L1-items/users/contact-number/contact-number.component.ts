import { Component, OnInit, Input } from '@angular/core';
import {constants} from '../../../../constants/constants';
import { checkNumber} from '../../../../services/object';

@Component({
  selector: 'app-i-forme-contact-number',
  templateUrl: './contact-number.component.html',
  styleUrls: ['./contact-number.component.css']
})
export class ContactNumberComponent implements OnInit {
  country_codes = constants.country_codes;
  @Input() contact_number: string;
  phone_number: string;
  country_code: string;
  codeErrMsg;
  phoneErrMsg;

  constructor() { }

  ngOnInit() {
    if(this.contact_number) {
      let contact_number = this.contact_number;
      contact_number = contact_number.replace(/^00/, '+');
      let contact_array = contact_number.split(" ");
      if(contact_array.length>1) {
        for (let i = 0; i < contact_array.length; i++) {
          if (i === 0) this.country_code = contact_array[i];
          else this.phone_number = contact_array[i];
        }
      }
      else this.phone_number = contact_array[0];
    }
  }

  selfValidateCode() {
    if(!this.country_code) {
      this.codeErrMsg = "Please select country code";
      return false;
    }
    this.getContactNumber();
    delete this.codeErrMsg;
    return true;
  }

  selfValidateNumber() {
    if(!this.phone_number) {
      this.phoneErrMsg = "Please enter phone number";
      return false;
    }

    if(this.phone_number) {
      if(!checkNumber(this.phone_number)) {
        this.phoneErrMsg = "Please enter only digits";
        return false;
      }
      if(this.phone_number.toString().length < 4) {
        this.phoneErrMsg = "Please enter minimum 4 digits";
        return false;
      }
      if(this.phone_number.toString().length > 15) {
        this.phoneErrMsg = "Please enter  maximum 15 digits";
        return false;
      }
    }
    this.getContactNumber();
    delete this.phoneErrMsg;
    return true;
  }

  getContactNumber() {
    if(this.country_code && this.phone_number) {
      this.contact_number = this.country_code +' '+ this.phone_number;
    }
  }
}
