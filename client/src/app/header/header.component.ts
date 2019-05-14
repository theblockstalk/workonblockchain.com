import { Component, OnInit, Inject } from '@angular/core';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { DatePipe } from '@angular/common';
import { DataService } from "../data.service";
import { LOCAL_STORAGE, WINDOW } from '@ng-toolkit/universal';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  currentUser: User;
  user_type;
  is_admin;
  route;
  admin_route;
  is_verify;
  date;
  msg;
  increment;
  user_name = 'Admin';
  setting;
  log;
  success;
  success_msg;
  location;

  constructor(@Inject(WINDOW) private window: Window, @Inject(LOCAL_STORAGE) private localStorage: any, private authenticationService: UserService,private dataservice: DataService,private router: Router,location: Location,private datePipe: DatePipe)
  {
    this.success_msg='';
    router.events.subscribe((val) => {
      if(location.path() != ''){
        this.route = location.path();
        let loc= this.route;
        this.location = loc;
        let x = loc.split("-");
        this.admin_route = window.location.pathname;
      } else {
        //this.route = 'Home'
      }
    });


    if(localStorage.getItem('currentUser')) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

      if (this.currentUser) {
        this.user_type = this.currentUser.type;

        if (this.user_type === 'candidate') {

          this.authenticationService.getById(this.currentUser._id)
            .subscribe(
              data => {

                if (data) {
                  this.is_verify = data['is_verify'];
                  if (this.is_verify == 0) {
                    this.success_msg = "not verify";
                  }
                  else {
                    this.success_msg = '';
                  }
                  this.is_admin = data['is_admin'];
                  this.user_name = data['first_name'] + ' ' + data['last_name'];
                  if (this.is_admin === 1) {
                    //this.admin_route = '/admin';
                  }
                  else {
                    this.admin_route = '';
                  }
                }
              });
        }
        else if (this.user_type === 'company') {

          this.authenticationService.getCurrentCompany(this.currentUser._id)
            .subscribe(
              data => {
                if (data) {
                  this.is_verify = data['_creator'].is_verify;
                  if (this.is_verify == 0) {
                    this.success_msg = "not verify";
                  }
                  else {
                    this.success_msg = '';
                  }
                  this.is_admin = data['_creator'].is_admin;
                  this.user_name = data['first_name'] + ' ' + data['last_name'];
                  if (this.is_admin === 1) {
                    //this.admin_route = '/admin';
                  }
                  else {
                    this.admin_route = '';
                  }
                }
              });
        }
      }
      else {
        this.currentUser = null;
        this.user_type = '';

      }
    }
  }

  ngOnInit()
  {
    this.success='';
    this.success_msg = '';
    this.msg='';

    if(this.currentUser)
    {
      this.dataservice.currentMessage.subscribe(message => this.msg = message);
      setInterval(() => {
        this.msg = "" ;
      }, 30000);
      this.close = JSON.parse(this.localStorage.getItem('close_notify'));
    }

  }



  close;
  close_notify()
  {
    this.success_msg='';
    this.close = "close";
    this.localStorage.setItem('close_notify', JSON.stringify(this.close));

  }

  logout()
  {

    this.authenticationService.destroyToken(this.currentUser._id)
      .subscribe(
        data => {
          if(data)
          {

          }

        },
        error =>
        {

        });


    this.localStorage.removeItem('currentUser');
    this.localStorage.removeItem('googleUser');
    this.localStorage.removeItem('close_notify');
    this.localStorage.removeItem('linkedinUser');
    this.localStorage.removeItem('admin_log');


  }


}
