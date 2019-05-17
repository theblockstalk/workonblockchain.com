import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-i-forme-first-name',
  templateUrl: './first-name.component.html',
  styleUrls: ['./first-name.component.css']
})
export class FirstNameComponent implements OnInit {
  @Input() first_name: string;
  @Output() updateFirstName: EventEmitter<string> = new EventEmitter<string>();
  selfValidate;
  constructor() { }

  ngOnInit() {
    this.selfValidate = function () {
      console.log("self validate");
      console.log(this.first_name)
      if(!this.first_name) {
        let errMsg = "Please enter first name";
        return {error: true, msg:errMsg};
      }
      this.updateFirstName.emit(this.first_name);
      return {error:false};
    }
  }

  getFirstName(name){
    console.log("get first name");
    this.first_name = name;
  }

}
