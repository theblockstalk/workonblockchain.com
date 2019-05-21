import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-c-forme-dropdown-multiple',
  templateUrl: './dropdown-multiselect.component.html',
  styleUrls: ['./dropdown-multiselect.component.css']
})
export class DropdownMultiselectComponent implements OnInit {
  @Input() options;
  @Input() label;
  @Input() value;
  @Input() checked;
  @Input() errorMsg;
  @Output () selectedValue: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

}
