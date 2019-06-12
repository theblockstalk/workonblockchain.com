import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-c-formv-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.css']
})
export class TextValueComponent implements OnInit {
  @Input() label: string;
  @Input() value: string;
  constructor() { }

  ngOnInit() {
  }

}
