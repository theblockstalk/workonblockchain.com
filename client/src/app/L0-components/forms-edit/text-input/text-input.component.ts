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
  @Input() errorMsg: string;
  @Output() textInputChange: EventEmitter<string> = new EventEmitter<string>();
  constructor() { }

  ngOnInit() {
  }

  valueChange() {
    console.log("value change");
    console.log(this.value);
  }

}
