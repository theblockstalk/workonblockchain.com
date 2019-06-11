import { Component, OnInit, Input } from '@angular/core';
import { regexs } from '../../../../constants/regex';

@Component({
  selector: 'app-i-forme-github-url',
  templateUrl: './github-url.component.html',
  styleUrls: ['./github-url.component.css']
})
export class GithubUrlComponent implements OnInit {
  @Input() github_account: string;
  errMsg;
  constructor() { }

  ngOnInit() {
  }

  selfValidate() {
    if (this.github_account) {
      const regex = new RegExp(regexs.url_regex);
      if (!regex.test(this.github_account)) {
        this.errMsg = 'Enter url in proper format';
        return false;
      }
      delete this.errMsg;
      return true;
    }
    else return true;
  }
}
