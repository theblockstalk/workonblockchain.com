import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-c-forme-text',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css']
})
export class TextInputComponent implements OnInit {
  @Input() label: string;
  @Input() placeholder: string;
  @Input() value: string;
  errorMsg: string;
  @Input() validate;
  @Output() updatedValue: EventEmitter<string> = new EventEmitter<string>();
  constructor() { }

  ngOnInit() {
    console.log(this.validate);
  }

  textChanged(event) {
    console.log("text changed");
    const valid = this.validate();
    console.log(valid);
    if(valid.error) {
      this.errorMsg = valid.msg;
    }
    this.updatedValue.emit(event);
  }

}
