import { Component, OnInit, Input } from '@angular/core';
import { regexs } from '../../../../constants/regex';

@Component({
  selector: 'app-i-forme-stackoverflow-url',
  templateUrl: './stackoverflow-url.component.html',
  styleUrls: ['./stackoverflow-url.component.css']
})
export class StackoverflowUrlComponent implements OnInit {
  @Input() stackoverflow_url: string;
  errMsg;
  constructor() { }

  ngOnInit() {
  }

  selfValidate() {
    if (this.stackoverflow_url) {
      const regex = new RegExp(regexs.url_regex);
      if (!regex.test(this.stackoverflow_url)) {
        this.errMsg = 'Enter url in proper format';
        return false;
      }
      delete this.errMsg;
      return true;
    }
    else return true;
  }

}
