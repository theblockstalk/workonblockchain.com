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
  @Input() value: object;
  @Output() selectedValue: EventEmitter<object> = new EventEmitter<object>();
  platforms;
  constructor() { }

  ngOnInit() {

  }

  selectedItem(event, label) {
    this.selectedValue.emit({label: label, exp_year: event.target.value});
  }

  selectedOption(item) {
    if(this.value['name'] === this.label && this.value['exp_year'] === item) return true;
    if(this.value['skill'] === this.label && this.value['exp_year'] === item) return true;
    if(this.value['language'] === this.label && this.value['exp_year'] === item) return true;
    return false;
  }
}
