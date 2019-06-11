import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-c-alert',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {
  @Input() message: string;
  @Input() level: string; // "warn", "info", "success"
  @Input() alignment: string; // "left", "center", "right"
  class;
  constructor() { }

  ngOnInit() {
    this.class = this.level + ' ' + this.alignment;
  }

}
