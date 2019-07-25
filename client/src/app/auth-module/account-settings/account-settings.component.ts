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

  password = true;
  ngOnInit()
  {
    this.inform = '';
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(this.currentUser && this.currentUser.type === 'candidate')
    {

      this.authenticationService.getCandidateProfileById(this.currentUser._id , false)
        .subscribe(
          data =>
          {
            if(data && data['password']=== false) {
              this.password = false;
            }
            if(data['is_unread_msgs_to_send']){
              this.info.unread_msgs_emails = data['is_unread_msgs_to_send'];
            }
            if(data['disable_account'] || data['marketing_emails'])
            {
              this.info.marketing = data['marketing_emails'];
              this.info.disable_account = data['disable_account'];
            }
          });
    }

    else if(this.currentUser && this.currentUser.type === 'company')
    {
      this.authenticationService.getCurrentCompany(this.currentUser._id, false)
        .subscribe(
          data =>
          {
            if(data['_creator'].is_unread_msgs_to_send){
              this.info.unread_msgs_emails = data['_creator'].is_unread_msgs_to_send;
            }
            if(data['_creator'].disable_account || data['marketing_emails'])
            {
              this.info.marketing = data['marketing_emails'];
              this.info.disable_account= data['_creator'].disable_account;
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
  status;
  account_setting(statusName , statusValue)
  {
    let queryInput : any = {};
    this.inform = '';
    if(statusName === 'marketingEmail') {
      queryInput.marketing_emails = this.info.marketing;
    }
    if(statusName === 'disabledAccount') {
      queryInput.disable_account = this.info.disable_account;
    }

    if(statusName === 'unreadMsgNotification') {
      queryInput.is_unread_msgs_to_send = this.info.unread_msgs_emails;
    }


    if(this.currentUser)
    {
      this.authenticationService.account_settings(queryInput)
        .subscribe(
          data =>
          {
            this.inform = data;
          },
          error => {
            if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false)
            {
              this.log = error['error']['message'];
            }
            else if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false)
            {
              this.log = error['error']['message'];
            }
            else {
              this.log = "Something went wrong";
            }

          }
        );
    }

  }

}
