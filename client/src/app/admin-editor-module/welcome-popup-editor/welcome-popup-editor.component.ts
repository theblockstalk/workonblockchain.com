import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import {NgForm} from '@angular/forms';
import {User} from '../../Model/user';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-welcome-popup-editor',
  templateUrl: './welcome-popup-editor.component.html',
  styleUrls: ['./welcome-popup-editor.component.css']
})
export class WelcomePopupEditorComponent implements OnInit {

  currentUser: User;
  name = 'ng2-ckeditor';
  ckeConfig: any;
  mycontent: string;
  log: string = '';
  @ViewChild("myckeditor") ckeditor: any;
  candidate_msg;
  companyMsgName;
  candidateMsgName;
  admin_log;
  candidateMsgTitle;
  candidateMsgContent;
  companyMsgTitle;
  companyMsgContent;
  success;
  error;
  company_error;
  company_success;

  constructor(private http: HttpClient,private route: ActivatedRoute,private router: Router,private authenticationService: UserService,private dataservice: DataService) {

  }

  ngOnInit() {

    setInterval(() => {
      this.error = '';
      this.success = '';
      this.company_success = '';
      this.company_error = '';
    }, 10000);
    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      height: '35rem',
      minHeight: '10rem',
    };

    this.candidateMsgName = 'Candidate popup message';
    this.companyMsgName = 'Company popup message';

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.admin_log = JSON.parse(localStorage.getItem('admin_log'));

    if(this.currentUser && this.admin_log )
    {
      if(this.admin_log.is_admin === 1)
      {
        this.authenticationService.get_page_content(this.candidateMsgName)
          .subscribe(
            data => {
              if(data)
              {
                this.candidateMsgTitle = data[0].page_title;
                this.candidateMsgContent = data[0].page_content;

              }
            });
        this.authenticationService.get_page_content(this.companyMsgName)
          .subscribe(
            data => {
              if(data)
              {
                this.companyMsgTitle = data[0].page_title;
                this.companyMsgContent = data[0].page_content;

              }
            },
            error =>
            {
              if(error.message === 500 || error.message === 401)
              {
                localStorage.setItem('jwt_not_found', 'Jwt token not found');
                localStorage.removeItem('currentUser');
                localStorage.removeItem('googleUser');
                localStorage.removeItem('close_notify');
                localStorage.removeItem('linkedinUser');
                localStorage.removeItem('admin_log');
                window.location.href = '/login';

              }
              else
              {

              }
            }
          );
      }
      else
        this.router.navigate(['/not_found']);
    }
    else
    {
      this.router.navigate(['/not_found']);

    }
  }


  candidateMsg(editorForm: NgForm)
  {
    if(editorForm.value.page_title && editorForm.value.html_text){
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
          });
    }
    else{
      this.error="Please fill all fields";
    }
  }

  companyMsg(companyeditor: NgForm)
  {
    if(companyeditor.value.page_title && companyeditor.value.html_text){
      this.authenticationService.pages_content(companyeditor.value)
        .subscribe(
          data =>
          {
            if(data['error'])
            {
              this.company_error = "Something went wrong" ;

            }
            else
            {
              this.company_success = "Content Successfully Updated";
            }
          });
    }
    else{
      this.company_error="Please fill all fields";
    }
  }

}
