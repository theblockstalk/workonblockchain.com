import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'L0-text-value',
  templateUrl: './text-value.component.html',
  styleUrls: ['./text-value.component.css']
})
export class TextValueComponent implements OnInit {
  @Input() label;
  @Input() textValue;
  constructor() { }

  ngOnInit() {
  }

}
