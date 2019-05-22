import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-c-forme-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.css']
})
export class RadioComponent implements OnInit {
  @Input() label: string;
  @Input() value: string;
  @Input() options: object;
  @Input() errorMsg: string;
  @Output() selectedOption: EventEmitter<string> = new EventEmitter<string>();
  constructor() { }

  ngOnInit() {
  }

}
