import { Component, OnInit, Input, Output, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
declare var $:any;

@Component({
  selector: 'app-c-forme-dropdown-single',
  templateUrl: './dropdown-single.component.html',
  styleUrls: ['./dropdown-single.component.css']
})
export class DropdownSingleComponent implements OnInit {
  @Input() options: string[];
  @Input() label: string;
  @Input() value: string;
  @Input() errorMsg: string;
  @Output() selectedValue: EventEmitter<string> = new EventEmitter<string>();
  labelClass = '';
  optionsType;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    if(this.options) {
      if(this.options[0].hasOwnProperty('name')) this.optionsType = 'paired-array';
      else this.optionsType = 'array';
    }
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        $('.selectpicker').selectpicker();
        $('.selectpicker').selectpicker('refresh');
      }, 300);
    }
    if(!this.label) {
      this.labelClass = 'd-none';
      this.label = "Don't show";
    }
  }

  valueChanged(event) {
    this.selectedValue.emit(event.target.value);
  }

  isEmptyObject(obj) {
    for(let prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        return false;
      }
    }
    return true;
  }
}
