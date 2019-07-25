import { Component, OnInit, Input } from '@angular/core';
import { regexs } from '../../../../constants/regex';

@Component({
  selector: 'app-i-forme-stackexchange-url',
  templateUrl: './stackexchange-url.component.html',
  styleUrls: ['./stackexchange-url.component.css']
})
export class StackexchangeUrlComponent implements OnInit {
  @Input() stackexchange_account: string;
  errMsg;
  constructor() { }

  ngOnInit() {
  }

  selfValidate() {
    if (this.stackexchange_account) {
      const regex = new RegExp(regexs.url_regex);
      if (!regex.test(this.stackexchange_account)) {
        this.errMsg = 'Enter url in proper format';
        return false;
      }
      delete this.errMsg;
      return true;
    }
    else return true;
  }

}
