import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-i-forme-first-name',
  templateUrl: './first-name.component.html',
  styleUrls: ['./first-name.component.css']
})
export class FirstNameComponent implements OnInit {
  @Input() first_name: string;
  @Output() updateFirstName: EventEmitter<string> = new EventEmitter<string>();
  errMsg = "Please enter first name";
  constructor() { }

  ngOnInit() {
    this.selfValidate();
  }

  selfValidate() {
    if(!this.first_name) {
      this.errMsg = "Please enter first name";
      this.updateFirstName.emit('');
      return false;
    }
    //delete this.errMsg;
    this.updateFirstName.emit(this.first_name);
    return true;
  }

}
