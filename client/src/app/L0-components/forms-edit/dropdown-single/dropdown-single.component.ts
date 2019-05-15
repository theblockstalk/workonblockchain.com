import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-c-forme-dropdown-single',
  templateUrl: './dropdown-single.component.html',
  styleUrls: ['./dropdown-single.component.css']
})
export class DropdownSingleComponent implements OnInit {
  @Input() options;
  @Input() label;
  @Input() value;
  @Output () selectedValue : EventEmitter<any> = new EventEmitter<any>();
  labelClass = '';

  constructor() { }

  ngOnInit() {
    if(!this.label) this.labelClass = 'invisible';
  }

  valueChanged(event) {
    this.selectedValue.emit(event.target.value);
  }
}
