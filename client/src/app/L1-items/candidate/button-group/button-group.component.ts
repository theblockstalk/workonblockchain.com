import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ButtonGroupObject, Options} from '../../../../constants/interface';

@Component({
  selector: 'app-c-forme-button-group',
  templateUrl: './button-group.component.html',
  styleUrls: ['./button-group.component.css']
})

export class ButtonGroupComponent implements OnInit {
  @Input() label: string;
  @Input() options: Options[]; // [{name: '1-2', value:'1-2', checked: true}, ................]
  @Input() errorMsg: string;
  @Input() value: string; // '1-2', '2-4', '4-6', '6+'
  @Output() selectedValue: EventEmitter<ButtonGroupObject> = new EventEmitter<ButtonGroupObject>(); // {label: 'bitcoin', exp_year: '1-2'}
  platforms;
  constructor() { }

  ngOnInit() {

  }

  selectedItem(event, label) {
    this.selectedValue.emit({label: label, exp_year: event.target.value});
  }

  selectedOption(item) {
    if(this.value === item) return true;
    return false;
  }
}
