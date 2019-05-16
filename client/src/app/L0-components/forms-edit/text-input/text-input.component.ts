import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-c-forme-text',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css']
})
export class TextInputComponent implements OnInit {
  @Input() label: string;
  @Input() placeholder: string;
  @Input() textValue: string;
  @Output() updatedValue : EventEmitter<string> = new EventEmitter<string>();
  constructor() { }

  ngOnInit() {
    console.log(this.textValue);
  }


}
