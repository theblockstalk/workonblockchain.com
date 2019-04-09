import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'L0-dropdown-single',
  templateUrl: './dropdown-single.component.html',
  styleUrls: ['./dropdown-single.component.css']
})
export class DropdownSingleComponent implements OnInit {
  @Input() dropdownList;
  @Input() label;
  @Output () selectedValue : EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

  valueChanged(event) {
    this.selectedValue.emit(event.target.value);
  }
}
