import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-github-url',
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
      const regex = new RegExp("^(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,10}(:[0-9]{1,5})?(\\/.*)?$");
      if (!regex.test(this.github_account)) {
        this.errMsg = "Enter url in proper format.";
        return true;
      }
      delete this.errMsg;
      return false;
    }
  }
}
