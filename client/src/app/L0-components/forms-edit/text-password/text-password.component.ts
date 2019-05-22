import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-c-forme-text-password',
  templateUrl: './text-password.component.html',
  styleUrls: ['./text-password.component.css']
})
export class TextPasswordComponent implements OnInit {
  @Input() label: string;
  @Input() placeholder: string; //optional
  @Input() errorMsg: string;
  @Output() textPasswordValue: EventEmitter<string> = new EventEmitter<string>();
  constructor() { }

  ngOnInit() {
  }

}
