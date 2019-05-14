import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import {NgForm} from '@angular/forms';
import {User} from '../../Model/user';
import { DataService } from '../../data.service';
import { LOCAL_STORAGE, WINDOW } from '@ng-toolkit/universal';

@Component({
  selector: 'app-admin-faq-editor',
  templateUrl: './admin-faq-editor.component.html',
  styleUrls: ['./admin-faq-editor.component.css']
})
export class AdminFaqEditorComponent implements OnInit {

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

  constructor(@Inject(WINDOW) private window: Window, @Inject(LOCAL_STORAGE) private localStorage: any, private http: HttpClient,private route: ActivatedRoute,private router: Router,private authenticationService: UserService,private dataservice: DataService) {

  }

  ngOnInit() {

       setInterval(() => {
                                this.error = "" ;
                                this.success = "" ;
                        }, 5000);


       this.dataservice.currentMessage.subscribe(message => this.message = message);
       this.ckeConfig = {
            allowedContent: false,
            extraPlugins: 'divarea',
            forcePasteAsPlainText: true,
            height: '35rem',
            minHeight: '10rem',
            //removePlugins: 'resize,elementspath',
            //removeButtons:'Underline,Subscript,Superscript'
        };

     // config.removeButtons = 'Underline,Subscript,Superscript';


      this.page_name = 'FAQ';

     this.currentUser = JSON.parse(this.localStorage.getItem('currentUser'));
        this.admin_log = JSON.parse(this.localStorage.getItem('admin_log'));

       if(this.currentUser && this.admin_log )
        {
           if(this.admin_log.is_admin == 1)
           {
             this.authenticationService.get_page_content(this.page_name)
            .subscribe(
                data => {
                   if(data)
                   {
                        this.page_title = data[0]['page_title'];
                       this.editor_content = data[0]['page_content'];
                   }
                 },

                 error =>
                 {
                     if(error['message'] === 500 || error['message'] === 401)
                     {
                         this.localStorage.setItem('jwt_not_found', 'Jwt token not found');
                         this.localStorage.removeItem('currentUser');
                                        this.localStorage.removeItem('googleUser');
                                        this.localStorage.removeItem('close_notify');
                                        this.localStorage.removeItem('linkedinUser');
                                        this.localStorage.removeItem('admin_log');
                            this.window.location.href = '/login';

                     }
                     else
                     {

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
	   if(editorForm.value.page_title && editorForm.value.html_text){
		   this.editor_text = this.editor_content;
		   this.authenticationService.pages_content(editorForm.value)
		   .subscribe(
		   data =>
		   {
			   if(data)
			   {
				   this.success = "Content Successfully Updated";
			   }
			   else
			   {
				   this.error="Something went wrong";

			   }
		   },
		   error =>
		   {

		   });
	   }
	   else{
		   this.error="Please fill all fields";
	   }
   }
}
