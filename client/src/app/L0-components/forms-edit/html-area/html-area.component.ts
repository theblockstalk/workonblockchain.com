import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'L0-html-area',
  templateUrl: './html-area.component.html',
  styleUrls: ['./html-area.component.css']
})
export class HtmlAreaComponent implements OnInit {
  @Input() label;
  @Input() formattingBar;
  @Input() height;
  @Input() width;
  @Input() value;
  ckeEditorConfig;
  formattingClass;
  constructor() { }

  ngOnInit() {
    if(this.formattingBar === 'true') this.formattingClass = 'ckeditor_tab';
    const ckeEditor =  {
      allowedContent: false,
      extraPlugins: 'divarea'
    };

    if(this.height) ckeEditor['height'] = this.height + 'rem';
    if(this.width) ckeEditor['width'] = this.width + 'rem';
    this.ckeEditorConfig = ckeEditor;
  }

}
