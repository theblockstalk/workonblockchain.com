import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {

  disable_account;
  marketing = true;
  currentUser: User;
  info: any = {};
  log;
  message;
  unread_msgs_emails = true;

  constructor(private http: HttpClient,private route: ActivatedRoute,private router: Router,private authenticationService: UserService,private dataservice: DataService)
  { }

  ngOnInit()
  {
    this.inform = '';
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(this.currentUser && this.currentUser.type === 'candidate')
    {

      this.authenticationService.getById(this.currentUser._id)
        .subscribe(
          data =>
          {
            if(data._creator.is_unread_msgs_to_send){
              this.info.unread_msgs_emails = data._creator.is_unread_msgs_to_send;
            }
            if(data._creator.disable_account || data.marketing_emails)
            {
              this.info.marketing = data.marketing_emails;
              this.info.disable_account= data._creator.disable_account;
            }
          });
    }

    else if(this.currentUser && this.currentUser.type === 'company')
    {
      this.authenticationService.getCurrentCompany(this.currentUser._id)
        .subscribe(
          data =>
          {
            if(data._creator.is_unread_msgs_to_send){
              this.info.unread_msgs_emails = data._creator.is_unread_msgs_to_send;
            }
            if(data._creator.disable_account || data.marketing_emails)
            {
              this.info.marketing = data.marketing_emails;
              this.info.disable_account= data._creator.disable_account;
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

            if(error.message === 403)
            {
              // this.router.navigate(['/not_found']);
            }
          });
    }

    else
    {
      this.router.navigate(['/not_found']);

    }
  }

  inform;
  account_setting()
  {
    this.inform='';
    this.message = '';
    if(this.currentUser && this.currentUser.type=='candidate')
    {
      this.authenticationService.terms(this.currentUser._creator,this.info)
        .subscribe(
          data =>
          {
            if(data.error )
            {
              this.log = data.error;
            }
            else
            {
              this.inform = data;

              if(this.info.marketing){
                this.message = 'Your profile is currently enabled for marketing emails.';
              }
              else{
                this.message = 'Your profile is currently disabled for marketing emails.';
              }
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

            if(error.message === 403)
            {
              // this.router.navigate(['/not_found']);
            }
          });
    }

    if(this.currentUser && this.currentUser.type=='company')
    {
      this.authenticationService.company_terms(this.currentUser._creator,this.info)
        .subscribe(
          data => {


            if(data.error )
            {
              this.log=data.error;
            }

            else
            {
              this.inform=data;

              if(this.info.marketing){
                this.message = 'Your profile is currently enabled for marketing emails.';
              }
              else{
                this.message = 'Your profile is currently disabled for marketing emails.';
              }
            }

          },
          error => {
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

            if(error.message === 403)
            {
              // this.router.navigate(['/not_found']);
            }

          });
    }
  }

  disbale_setting()
  {

    this.inform='';
    if(this.currentUser)
    {
      this.authenticationService.set_disable_status(this.currentUser._creator,this.info.disable_account)
        .subscribe(
          data =>
          {

              this.inform=data;
              if(this.info.disable_account){
                this.message = 'Your profile is currently disabled';
              }
              else{
                this.message = 'Your profile is currently enabled';

              }

          },
          error => {
            if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false)
            {
              this.log = error['error']['message'];
            }

          }
        );
    }

  }
  unread_msgs_emails_send(){
    this.inform='';
    if(this.currentUser)
    {
      this.authenticationService.set_unread_msgs_emails_status(this.info.unread_msgs_emails)
        .subscribe(
          data =>
          {
            if(data.error )
            {
              this.log=data.error;
            }
            else
            {
              this.inform=data;
              if(this.info.unread_msgs_emails){
                this.message = 'Your profile is currently enabled for unread chat messages email';
              }
              else{
                this.message = 'Your profile is currently disabled for unread chat messages email';
              }
            }
          },
          error => {
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

            if(error.message === 403)
            {
              // this.router.navigate(['/not_found']);
            }

          }
        );
    }

  }

}
