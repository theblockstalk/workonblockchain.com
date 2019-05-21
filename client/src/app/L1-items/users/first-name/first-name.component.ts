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
    console.log("self validate");
    console.log(this.first_name);
    if(!this.first_name) {
      this.errMsg = "Please enter first name";
      console.log("iffff error");
      return false;
    }
    delete this.errMsg;
    return true;
  }

}
