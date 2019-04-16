import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-autosuggest-cities-badges',
  templateUrl: './autosuggest-cities-badges.component.html',
  styleUrls: ['./autosuggest-cities-badges.component.css']
})
export class AutosuggestCitiesBadgesComponent implements OnInit {
  @Input() selectedItems;
  @Output() updatedSelectedItems: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

  updateSelectedItem(event) {
    let objIndex = this.selectedItems.findIndex((obj => obj.name === event.target.value));
    this.selectedItems[objIndex].visa_needed = event.target.checked;
    this.updatedSelectedItems.emit(this.selectedItems);
  }

  deleteSelectedItem(i) {
    this.selectedItems.splice(i, 1);
    this.updatedSelectedItems.emit(this.selectedItems);
  }

}
