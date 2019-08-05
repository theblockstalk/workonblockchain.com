import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-c-forme-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.css']
})
export class TextAreaComponent implements OnInit {
  @Input() label: string;
  @Input() placeholder: string; //optional
  @Input() rows: number; //3, 4 , ....
  @Input() errorMsg: string;
  @Input() value: string;
  @Input() field_description: string; //optional
  @Input() maxLength: number; //optional
  @Output() textareaInput: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

}
