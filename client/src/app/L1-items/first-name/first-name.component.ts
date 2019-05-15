import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-i-forme-first-name',
  templateUrl: './first-name.component.html',
  styleUrls: ['./first-name.component.css']
})
export class FirstNameComponent implements OnInit {
  @Input() first_name: string;
  value;
  errorMsg;
  constructor() { }

  ngOnInit() {
    this.first_name = this.value;
  }

  selfValidate() {
    if(!this.value) {
      this.errorMsg = "Please enter first name";
      return false;
    }
    // this.formOutput.emit(this.textValue);
    return true;
  }

}
