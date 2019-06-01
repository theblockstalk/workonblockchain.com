import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-c-formv-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.css']
})
export class BadgeViewComponent implements OnInit {
  @Input() value: string;
  @Input() class: string; //'primary', 'secondary', 'success', 'warning', 'danger'
  @Input() rounded = true; //optional true, false
  constructor() { }

  ngOnInit() {
  }

}
