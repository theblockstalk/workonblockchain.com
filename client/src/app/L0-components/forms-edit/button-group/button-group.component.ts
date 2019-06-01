import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ButtonGroupObject, Options} from '../../../../constants/interface';

@Component({
  selector: 'app-c-forme-button-group',
  templateUrl: './button-group.component.html',
  styleUrls: ['./button-group.component.css']
})

export class ButtonGroupComponent implements OnInit {
  @Input() label: string;
  @Input() options: Options[];
  @Input() errorMsg: string;
  @Input() value: string; // '1-2', '2-4', '4-6', '6+'
  @Output() selectedValue: EventEmitter<ButtonGroupObject> = new EventEmitter<ButtonGroupObject>();
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
