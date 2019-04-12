import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'L0-autosuggest-selected-value',
  templateUrl: './autosuggest-selected-value.component.html',
  styleUrls: ['./autosuggest-selected-value.component.css']
})
export class AutosuggestSelectedValueComponent implements OnInit {
  @Input() selectedItems;
  @Output() updatedSelectedItems: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

  deleteItem(index) {
    this.selectedItems.splice(index, 1);
    this.updatedSelectedItems.emit(this.selectedItems);
  }

}
