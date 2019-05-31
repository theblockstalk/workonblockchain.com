import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { unCheckCheckboxes } from '../../../../services/object';
import { Options} from '../../../../constants/interface';

@Component({
  selector: 'app-c-forme-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css']
})
export class CheckboxComponent implements OnInit {
  @Input() label: string;
  @Input() errorMsg: string;
  @Input() options: Options[];
  @Input() value: Array<string>; // ['bitcoin', 'ethereum'.....]
  @Input() iconClass: string; //for work types optional
  @Input() column: number; //3, 4
  @Input() icon: boolean; // for blockchain listing optional
  @Output() selectedItem: EventEmitter<Array<string>> = new EventEmitter<Array<string>>(); // ['bitcoin', 'ethereum'.....]
  selectedOptions = [];
  constructor() { }

  ngOnInit() {
    this.options = unCheckCheckboxes(this.options);
    if(this.value) {
        this.selectedOptions = this.value;
    }
  }

  selectedValues(event) {
    if(event.target.checked)
    {
      this.selectedOptions.push(event.target.value);
    }
    else{
      let updateItem = this.selectedOptions.find(x => x === event.target.value);
      let index = this.selectedOptions.indexOf(updateItem);
      this.selectedOptions.splice(index, 1);
    }
    this.selectedItem.emit(this.selectedOptions);
  }

  selectedCheckboxes(value) {
    if(this.selectedOptions && this.selectedOptions.length > 0) {
      if(this.selectedOptions.find(x => x === value)) return true;
      else return false;
    }
  }

}
