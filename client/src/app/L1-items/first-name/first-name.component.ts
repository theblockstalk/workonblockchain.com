import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-i-forme-first-name',
  templateUrl: './first-name.component.html',
  styleUrls: ['./first-name.component.css']
})
export class FirstNameComponent implements OnInit {
  @Input() first_name: string;
  errMsg;
  constructor() { }

  ngOnInit() {
  }

  selfValidate(){
    if(!this.first_name) {
      this.errMsg = "Please enter first name";
      return true;
    }
    delete this.errMsg;
    return false;
  }


}
