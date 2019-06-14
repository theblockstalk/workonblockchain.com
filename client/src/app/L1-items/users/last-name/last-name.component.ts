import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-i-forme-last-name',
  templateUrl: './last-name.component.html',
  styleUrls: ['./last-name.component.css']
})
export class LastNameComponent implements OnInit {
  @Input() last_name: string;
  errMsg;
  constructor() { }

  ngOnInit() {
  }

  selfValidate(){
    if(!this.last_name) {
      this.errMsg = 'Please enter last name';
      return false;
    }
    delete this.errMsg;
    return true;
  }

}
