import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-c-formv-html-area',
  templateUrl: './html-area.component.html',
  styleUrls: ['./html-area.component.css']
})
export class HtmlAreaViewComponent implements OnInit {
  @Input() value: string;
  @Input() class: string; //p-2 etc optional
  @Input() label: string; //optional

  constructor() { }

  ngOnInit() {
  }

}
