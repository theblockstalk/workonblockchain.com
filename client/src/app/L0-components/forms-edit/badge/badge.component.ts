import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-c-forme-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.css']
})
export class AutosuggestSelectedValueComponent implements OnInit {
  @Input() label: string;
  @Input() class: string; //"primary", "secondary", "danger", "warning"
  @Output() deleteItem: EventEmitter<''> = new EventEmitter<''>();
  constructor() { }

  ngOnInit() { }

}
