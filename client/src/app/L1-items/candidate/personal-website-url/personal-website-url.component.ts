import { Component, OnInit, Input } from '@angular/core';

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
      const regex = new RegExp("^(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,10}(:[0-9]{1,5})?(\\/.*)?$");
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
