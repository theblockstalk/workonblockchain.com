import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
declare var $:any;

@Component({
  selector: 'app-c-forme-dropdown-single',
  templateUrl: './dropdown-single.component.html',
  styleUrls: ['./dropdown-single.component.css']
})
export class DropdownSingleComponent implements OnInit {
  @Input() options;
  @Input() label;
  @Input() value;
  @Input() errorMsg;
  @Output () selectedValue: EventEmitter<any> = new EventEmitter<any>();
  labelClass = '';
  optionsType;
  constructor() {
    console.log(this.options);
    if(this.options) {
      // if(typeof this.options === 'array') this.optionsType = 'array';
    }
  }

  ngOnInit() {
    console.log("dropdown single");
    console.log(this.value);
    setTimeout(() => {
      $('.selectpicker').selectpicker();
      $('.selectpicker').selectpicker('refresh');
    }, 300);
    if(!this.label) this.labelClass = 'invisible';
  }

  valueChanged(event) {
    this.selectedValue.emit(event.target.value);
  }
}
