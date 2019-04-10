import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-html-area',
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
