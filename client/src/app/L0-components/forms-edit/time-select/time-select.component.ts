import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-c-forme-time-select',
  templateUrl: './time-select.component.html',
  styleUrls: ['./time-select.component.css']
})
export class TimeSelectComponent implements OnInit {
  @Input() label: string;
  @Input() errorMsg: string;
  @Input() placeholder = '00:00'; //optional
  @Input() value: string; // date format
  constructor() { }

  ngOnInit() {
  }

}
