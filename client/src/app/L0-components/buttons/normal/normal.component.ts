import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-c-button-normal',
  templateUrl: './normal.component.html',
  styleUrls: ['./normal.component.css']
})
export class OthersComponent implements OnInit {
  @Input() label: string;
  @Input() level: string; // "primary", "secondary", ... , "danger"
  @Input() alignment: string; // "left", "center", "right"
  @Input() buttonType: string; // "submit", "reset", "button"
  @Input() disabled: boolean; // true, false

  constructor() { }

  ngOnInit() {
  }

}
