import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-contact-number',
  templateUrl: './contact-number.component.html',
  styleUrls: ['./contact-number.component.css']
})
export class ContactNumberComponent implements OnInit {
  @Input() phone_number: number;
  @Input() country_code: string;
  codeErrMsg;
  phoneErrMsg
  constructor() { }

  ngOnInit() {
  }

  selfValidate() {
    if(!this.phone_number) {
      this.phoneErrMsg = "Please enter phone number";
      return true;
    }
    if(!this.country_code) {
      this.codeErrMsg = "Please select country code";
      return true;
    }
    if(this.phone_number) {
      if(this.phone_number.toString().length < 4 || this.phone_number.toString().length > 15) {
        this.phoneErrMsg = "Please enter minimum 4 and maximum 15 digits";
        return true;
      }
      if(!this.checkNumber(this.phone_number)) {
        this.phoneErrMsg = "Please enter only digits";
        return true;
      }
    }
    delete this.codeErrMsg;
    delete this.phoneErrMsg;
    return false;
  }

  checkNumber(number) {
    return /^[0-9]*$/.test(number);
  }
}
