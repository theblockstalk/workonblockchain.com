import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-autosuggest-badges',
  templateUrl: './autosuggest-badges.component.html',
  styleUrls: ['./autosuggest-badges.component.css']
})
export class AutosuggestBadgesComponent implements OnInit {
  @Input() selectedItems;
  @Output() updatedSelectedItems: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {}

  deleteSelectedItem(index) {
    this.selectedItems.splice(index, 1);
    this.updatedSelectedItems.emit(this.selectedItems);
  }

}
