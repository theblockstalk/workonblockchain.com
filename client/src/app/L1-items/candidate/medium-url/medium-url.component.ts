import { Component, OnInit, Input } from '@angular/core';
import { regexs } from '../../../../constants/regex';

@Component({
  selector: 'app-i-forme-medium-url',
  templateUrl: './medium-url.component.html',
  styleUrls: ['./medium-url.component.css']
})
export class MediumUrlComponent implements OnInit {
  @Input() medium_account: string;
  errMsg;
  constructor() { }

  ngOnInit() {
  }

  selfValidate() {
    if (this.medium_account) {
      const regex = new RegExp(regexs.url_regex);
      if (!regex.test(this.medium_account)) {
        this.errMsg = 'Enter url in proper format';
        return false;
      }
      delete this.errMsg;
      return true;
    }
    else return true;
  }

}
