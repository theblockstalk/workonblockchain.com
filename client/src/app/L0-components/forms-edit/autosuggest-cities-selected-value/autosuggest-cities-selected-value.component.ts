import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-autosuggest-cities-selected-value',
  templateUrl: './autosuggest-cities-selected-value.component.html',
  styleUrls: ['./autosuggest-cities-selected-value.component.css']
})
export class AutosuggestCitiesSelectedValueComponent implements OnInit {
  @Input() citiesBadgeText;
  @Input() visaNeeded;
  @Output() deleteItem: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateItem: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

  deleteRow() {
    this.deleteItem.emit();
  }

  updateSelectedItem() {
    this.updateItem.emit();
  }

}
