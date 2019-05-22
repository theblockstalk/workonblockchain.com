import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-c-formv-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.css']
})
export class BadgeViewComponent implements OnInit {
  @Input() class: string;
  @Input() rounded = true; //optional
  constructor() { }

  ngOnInit() {
  }

}
