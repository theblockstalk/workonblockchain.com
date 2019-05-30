import { Component, OnInit, Input } from '@angular/core';
import { regexs } from '../../../../constants/regex';

@Component({
  selector: 'app-i-forme-personal-website-url',
  templateUrl: './personal-website-url.component.html',
  styleUrls: ['./personal-website-url.component.css']
})
export class PersonalWebsiteUrlComponent implements OnInit {
  @Input() personal_website_url: string;
  errMsg;
  constructor() { }

  ngOnInit() {
  }

  selfValidate() {
    if (this.personal_website_url) {
      const regex = new RegExp(regexs.url_regex);
      if (!regex.test(this.personal_website_url)) {
        this.errMsg = 'Enter url in proper format';
        return false;
      }
      delete this.errMsg;
      return true;
    }
    else return true;
  }
}
