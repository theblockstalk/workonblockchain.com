import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../user.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-privacy-editor',
  templateUrl: './privacy-editor.component.html',
  styleUrls: ['./privacy-editor.component.css']
})
export class PrivacyEditorComponent implements OnInit {

	/*title = 'ngx-editor';
 

  editorConfig = {
    editable: true,
    spellcheck: false,
    height: '15rem',
    minHeight: '10rem',
    placeholder: 'Enter text...',
    translate: 'no'
  };*/
    
    editor_content;
    editor_text;
    name = 'ng2-ckeditor';
  ckeConfig: any;
  mycontent: string;
  log: string = '';
  @ViewChild("myckeditor") ckeditor: any;
    page_title;
    
  constructor(private http: HttpClient,private route: ActivatedRoute,private router: Router,private authenticationService: UserService) { 
	
  }

  ngOnInit() {
       this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true
    };
      
      this.page_title = 'Privacy Policy';
      
      this.authenticationService.get_page_content(this.page_title)
            .subscribe(
                data => {
                   if(data)
                   {
                       console.log(data);
                       this.editor_content = data[1].page_content;
                       console.log(this.editor_content);
                       
                   }
                 });
  }

    /*content;htmlContent;
  about()  
  {
      this.content = this.htmlContent;
      console.log(this.htmlContent);
      
   }
    */
   editor(editorForm: NgForm)
   {
       console.log(editorForm.value);
       this.editor_text = this.editor_content;  
       this.authenticationService.pages_content(editorForm.value)
       .subscribe(
       data => 
       {
       });
   }

}
