import { Component, OnInit, Input } from '@angular/core';

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
      const regex = new RegExp("^(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,10}(:[0-9]{1,5})?(\\/.*)?$");
      if (!regex.test(this.stackoverflow_url)) {
        this.errMsg = "Enter url in proper format";
        return false;
      }
      delete this.errMsg;
      return true;
    }
    else return true;
  }

}
