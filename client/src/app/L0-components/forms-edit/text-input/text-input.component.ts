import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-c-forme-text',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css']
})
export class TextInputComponent implements OnInit {
  @Input() label: string;
  @Input() placeholder: string; //optional
  @Input() value: string;
  @Input() errorMsg: string;
  @Input() disabled: boolean;
  @Input() field_description: string; //optional
  @Input() hasLable: boolean; //optional

  @Output() textInputValue: EventEmitter<string> = new EventEmitter<string>();
  constructor() { }

  ngOnInit() {

  }

}
