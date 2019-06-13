import { Component, OnInit, Input, ViewChild  } from '@angular/core';
import { UserService } from '../../user.service';
import { ContentComponent } from '../../L1-items/pages/content/content.component';
import { TitleComponent } from '../../L1-items/pages/title/title.component';

@Component({
  selector: 'app-p-pages-editor',
  templateUrl: './pages-editor.component.html',
  styleUrls: ['./pages-editor.component.css']
})
export class PagesEditorComponent implements OnInit {
  @ViewChild(ContentComponent) pageContent: ContentComponent;
  @ViewChild(TitleComponent) pageTitle: TitleComponent;
  @Input() pageDoc: object;

  page_content;
  page_title;
  page_name;
  successMsg;
  errorMsg;

  constructor(private authenticationService: UserService) { }

  ngOnInit() {
    console.log(this.pageDoc);
    if(this.pageDoc) {
      this.page_name = this.pageDoc['page_name'];
      this.page_content = this.pageDoc['page_content'];
      this.page_title = this.pageDoc['page_title'];
    }
  }

  update_page(){
    let queryBody : any = {};
    let errorCount = 0;
    if(this.pageContent.selfValidate()) queryBody.html_text = this.pageContent.content;
    else errorCount++;

    if(this.pageTitle.selfValidate()) queryBody.page_title = this.pageTitle.title;
    else errorCount++;

    if(errorCount === 0) {
      queryBody.page_name = this.page_name;
      console.log(queryBody)
      this.authenticationService.pages_content(queryBody)
        .subscribe(
          data =>
          {
            if(data) {
              this.successMsg = 'Content Successfully Updated';
            }
            else {
              this.errorMsg = 'Something went wrong';
            }
          },
          error =>
          {}
        );
    }
    else {
      this.errorMsg = 'One or more fields need to be completed. Please scroll up to see which ones.';
    }
  }

}
