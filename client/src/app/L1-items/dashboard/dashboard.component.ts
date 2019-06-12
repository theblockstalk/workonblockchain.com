import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'L1-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})

export class DashboardComponent implements OnInit {
  @Input() linkText: string;
  @Input() routeLink: string;
  @Input() iconClass: string;

  constructor() { }

  ngOnInit() {
  }

}
