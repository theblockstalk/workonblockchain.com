import {Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import {TextInputComponent} from '../../L0-components/forms-edit/text-input/text-input.component';

@Component({
  selector: 'app-i-forme-first-name',
  templateUrl: './first-name.component.html',
  styleUrls: ['./first-name.component.css']
})
export class FirstNameComponent implements OnInit {
  @Input() first_name: string;
  // @Output() updateFirstName: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild(TextInputComponent ) textInput: TextInputComponent;

  errMsg;
  constructor() { }

  ngOnInit() {
  }

  selfValidate(){
    this.first_name = this.textInput.value;
    if(!this.first_name) {
      this.errMsg = "Please enter first name";
      return false;
    }
    delete this.errMsg;
    return true;
  }


}
