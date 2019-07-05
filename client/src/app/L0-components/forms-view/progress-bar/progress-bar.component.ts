import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-c-formv-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent implements OnInit {
  @Input() value: number;
  @Input() class: string; //'success', 'warning', 'info'

  constructor() { }

  ngOnInit() {
  }

}
