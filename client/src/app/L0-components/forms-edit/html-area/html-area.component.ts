import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'L0-html-area',
  templateUrl: './html-area.component.html',
  styleUrls: ['./html-area.component.css']
})
export class HtmlAreaComponent implements OnInit {
  @Input() label;
  @Input() ckeEditorConfig;
  @Input() formattingClass;
  constructor() { }

  ngOnInit() {
  }

}
