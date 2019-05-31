import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-c-formv-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.css']
})
export class DateComponent implements OnInit {
  @Input() label: string;
  @Input() value: string; //date format
  constructor() { }

  ngOnInit() {
  }

}
