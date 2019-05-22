import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-c-forme-button-group',
  templateUrl: './button-group.component.html',
  styleUrls: ['./button-group.component.css']
})
export class ButtonGroupComponent implements OnInit {
  @Input() label: string;
  @Input() options: object;
  @Input() errorMsg: string;
  @Input() value: string;
  @Output() selectedValue: EventEmitter<object> = new EventEmitter<object>();
  constructor() { }

  ngOnInit() {
  }

}
