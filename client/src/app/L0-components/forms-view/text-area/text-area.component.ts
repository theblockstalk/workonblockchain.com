import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-c-formv-textarea',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.css']
})
export class TextAreaViewComponent implements OnInit {
  @Input() label: string;
  @Input() value: string;
  constructor() { }

  ngOnInit() {
  }

}
