import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'L0-autosuggest-selected-value',
  templateUrl: './autosuggest-selected-value.component.html',
  styleUrls: ['./autosuggest-selected-value.component.css']
})
export class AutosuggestSelectedValueComponent implements OnInit {
  @Input() badgeText;
  @Output() deleteItem: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {

  }

  deleteBadgeItem() {
    this.deleteItem.emit();
  }

}
