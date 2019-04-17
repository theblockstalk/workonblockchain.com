import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css']
})
export class TextInputComponent implements OnInit {
  @Input() label;
  @Input() placeholder;
  @Input() errorMsg;
  @Input() requiredErrorMsg;
 // @Input() textValue;
  @Input('textValue') textValue: string;
  //@Output() formOutput : EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

  selfValidate(){
    if(this.requiredErrorMsg) {
      if(!this.textValue) {
        this.errorMsg = this.requiredErrorMsg;
        return false;
      }
    }
    //this.formOutput.emit(this.textValue);
    return true;
  }
}
