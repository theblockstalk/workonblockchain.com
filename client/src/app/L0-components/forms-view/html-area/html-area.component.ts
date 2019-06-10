import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-c-formv-html-area',
  templateUrl: './html-area.component.html',
  styleUrls: ['./html-area.component.css']
})
export class HtmlAreaViewComponent implements OnInit {
  @Input() value: string;
  constructor() { }

  ngOnInit() {
  }

}
