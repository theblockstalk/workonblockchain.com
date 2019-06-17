import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-i-forme-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css']
})
export class TitleComponent implements OnInit {
  @Input() title: string;
  errMsg;

  constructor() { }

  ngOnInit() {
  }

  selfValidate(){
    if(!this.title) {
      this.errMsg = "Please enter page title";
      return false;
    }
    delete this.errMsg;
    return true;
  }

}
