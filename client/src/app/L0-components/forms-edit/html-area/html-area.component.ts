import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-c-forme-html-area',
  templateUrl: './html-area.component.html',
  styleUrls: ['./html-area.component.css']
})
export class HtmlAreaComponent implements OnInit {
  @Input() label: string;
  @Input() errorMsg: string;
  @Input() placeholder: string; //optional
  @Input() formattingBar: boolean = false; //optional
  @Input() height: number; //optional
  @Input() width: number; //optional
  @Input() value: string;
  @Input() removeButtons: boolean; //optional
  @Output() htmlAreaValue: EventEmitter<string> = new EventEmitter<string>();
  ckeEditorConfig;
  formattingClass;
  constructor() { }

  ngOnInit() {
    if(this.formattingBar) this.formattingClass = 'ckeditor_tab';
    const ckeEditor =  {
      allowedContent: false,
      extraPlugins: 'divarea'
    };

    if(this.height) ckeEditor['height'] = this.height + 'rem';
    if(this.width) ckeEditor['width'] = this.width + 'rem';
    if(this.removeButtons) ckeEditor['removeButtons'] = 'Cut,Copy,Paste,Undo,Redo,Anchor,Bold,Italic,Underline,Subscript,Superscript,Source,Save,Preview,Print,Templates,Find,Replace,SelectAll,NewPage,PasteFromWord,Form,Checkbox,Radio,TextField,Textarea,Button,ImageButton,HiddenField,RemoveFormat,TextColor,Maximize,ShowBlocks,About,Font,FontSize,Link,Unlink,Image,Flash,Table,Smiley,Iframe,Language,Indent,BulletedList,NumberedList,Outdent,Blockquote,CreateDiv,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock,BidiLtr,BidiRtl,HorizontalRule,SpecialChar,PageBreak,Styles,Format,BGColor,PasteText,CopyFormatting,Strike,Select,Scayt';
    this.ckeEditorConfig = ckeEditor;
  }

}
