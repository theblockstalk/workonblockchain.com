import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
declare var $:any;

@Component({
  selector: 'app-c-forme-dropdown-multiple',
  templateUrl: './dropdown-multiple.component.html',
  styleUrls: ['./dropdown-multiple.component.css']
})
export class DropdownMultiselectComponent implements OnInit {
  @Input() options;
  @Input() label;
  @Input() value;
  @Input() checked;
  @Input() errorMsg;
  @Output () selectedValue: EventEmitter<any> = new EventEmitter<any>();
  optionsType;
  labelClass;
  constructor() { }

  ngOnInit() {
    if(this.options) {
      if(this.options[0].hasOwnProperty("name")) this.optionsType = 'paired-array';
      else this.optionsType = 'array';
    }
    setTimeout(() => {
      $('.selectpicker').selectpicker();
      $('.selectpicker').selectpicker('refresh');
    }, 300);
    if(!this.label) {
      this.labelClass = 'invisible';
      this.label = "Don't show";
    }
  }

}
