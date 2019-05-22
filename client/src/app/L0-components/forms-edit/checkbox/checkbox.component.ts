import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-c-forme-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css']
})
export class CheckboxComponent implements OnInit {
  @Input() label: string;
  @Input() errorMsg: string;
  @Input() options: object;
  @Input() value: string;
  @Output() selectedItem: EventEmitter<any> = new EventEmitter<any>();
  selectedOptions = [];
  constructor() { }

  ngOnInit() {
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

}
