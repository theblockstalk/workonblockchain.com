import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-c-forme-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.css']
})
export class AutosuggestSelectedValueComponent implements OnInit {
  @Input() label: string;
  @Input() class: string; //"badge-primary", "badge-secondary"....
  @Output() deleteItem: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {

  }

  deleteBadgeItem() {
    this.deleteItem.emit();
  }

}
