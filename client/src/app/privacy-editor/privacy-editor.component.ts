import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../user.service';
import {NgForm} from '@angular/forms';
import {User} from '../Model/user';
import { DataService } from "../data.service";

@Component({
  selector: 'app-privacy-editor',
  templateUrl: './privacy-editor.component.html',
  styleUrls: ['./privacy-editor.component.css']
})
export class PrivacyEditorComponent implements OnInit {

    currentUser: User;
    editor_content;
    editor_text;
    name = 'ng2-ckeditor';
    ckeConfig: any;
    mycontent: string;
    log: string = '';
    @ViewChild("myckeditor") ckeditor: any;
    page_title;
    page_name;
    admin_log;
    message;
    
  constructor(private http: HttpClient,private route: ActivatedRoute,private router: Router,private authenticationService: UserService,private dataservice: DataService) { 
	
  }

  ngOnInit() {
      this.dataservice.currentMessage.subscribe(message => this.message = message);
       this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true,
      height: '35rem',
    minHeight: '10rem',
    };
      
       setInterval(() => {  
                                this.error = "" ;
                                this.success = "" ;
                        }, 5000);
      
      this.page_name = 'Privacy Policy';
      
     this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.admin_log = JSON.parse(localStorage.getItem('admin_log'));
      
       if(this.currentUser && this.admin_log )
        {
           if(this.admin_log.is_admin == 1)
           {
             this.authenticationService.get_page_content(this.page_name)
            .subscribe(
                data => {
                   if(data)
                   {
                      // console.log(data);
                        this.page_title = data[0].page_title;
                       this.editor_content = data[0].page_content;
                       //console.log(this.editor_content);
                       
                   }
                 });
           }
           else
               this.router.navigate(['/not_found']);
        }
        else
        {
           this.router.navigate(['/not_found']);
          
        }
  }

    success; error;
   editor(editorForm: NgForm)
   {
       console.log(editorForm.value);
       this.editor_text = this.editor_content;  
       this.authenticationService.pages_content(editorForm.value)
       .subscribe(
       data => 
       {
           if(data)
           {
               this.success = "Content Successfully Updated";
               //this.dataservice.changeMessage("Content Successfully Updated");
           }
           else
           {
               this.error="Something went wrong";
               
           }
       },
       error =>
       {
             if(error.message == 500 || error.message == 401)
                    {
                        localStorage.setItem('jwt_not_found', 'Jwt token not found');
                        window.location.href = '/login';
                    }
                    
                    if(error.message == 403)
                    {
                        this.router.navigate(['/not_found']);                        
                    }      
       });
   }

}
