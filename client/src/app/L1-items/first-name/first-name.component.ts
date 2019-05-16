import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-i-forme-first-name',
  templateUrl: './first-name.component.html',
  styleUrls: ['./first-name.component.css']
})
export class FirstNameComponent implements OnInit {
  @Input() value: string;
  @Output() updateFirstName : EventEmitter<string> = new EventEmitter<string>();
  first_name;
  errorMsg;
  constructor() { }

  ngOnInit() {
    this.first_name = this.value;
    console.log(this.value);
  }

  selfValidate() {
    if(!this.value) {
      this.errorMsg = "Please enter first name";
      this.updateFirstName.emit('');
      return false;
    }
    this.updateFirstName.emit(this.value);
    return true;
  }

}
