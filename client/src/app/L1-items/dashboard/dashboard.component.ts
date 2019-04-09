import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'L1-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})

export class DashboardComponent implements OnInit {
  @Input() linkText;
  @Input() routeLink;
  @Input() iconClass;

  constructor() { }

  ngOnInit() {
  }

}
