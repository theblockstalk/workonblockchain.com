import { Component, OnInit, Input } from '@angular/core';
import { regexs } from '../../../../constants/regex';

@Component({
  selector: 'app-i-forme-linkedin-url',
  templateUrl: './linkedin-url.component.html',
  styleUrls: ['./linkedin-url.component.css']
})
export class LinkedinUrlComponent implements OnInit {
  @Input() linkedin_account: string;
  errMsg;
  constructor() { }

  ngOnInit() {
  }

  selfValidate() {
    if (this.linkedin_account) {
      const regex = new RegExp(regexs.url_regex);
      if (!regex.test(this.linkedin_account)) {
        this.errMsg = 'Enter url in proper format';
        return false;
      }
      delete this.errMsg;
      return true;
    }
    else return true;
  }

}
