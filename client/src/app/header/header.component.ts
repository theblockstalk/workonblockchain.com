import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { DatePipe } from '@angular/common';
import { DataService } from "../data.service";


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
  show_me_link;

  constructor(private authenticationService: UserService,private dataservice: DataService,private router: Router,location: Location,private datePipe: DatePipe)
  {
    this.success_msg='';
    router.events.subscribe((val) => {
      if(location.path() != ''){
        this.admin_route = window.location.pathname;
      } else {
        //this.route = 'Home'
      }
    });

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.show_me_link = false;
    if(this.currentUser )
    {
      this.user_type = this.currentUser.type;

      if(this.user_type === 'candidate')
      {
        setInterval(() => {
          if (this.show_me_link === false) {
            this.authenticationService.getById(this.currentUser._id)
              .subscribe(
                data =>
                {
                  if(data)
                  {
                    if(data.first_name && data.last_name ) {
                      this.show_me_link = true;
                    }

                    this.is_verify = data['_creator'].is_verify;
                    if(this.is_verify == 0)
                    {
                      this.success_msg = "not verify";
                    }
                    else
                    {
                      this.success_msg='';
                    }
                    this.is_admin = data['_creator'].is_admin;
                    this.user_name = data['first_name'] +' '+ data['last_name'];
                    if(this.is_admin === 1)
                    {
                      //this.admin_route = '/admin';
                    }
                    else
                    {
                      this.admin_route = '';
                    }
                  }
                });
          }
        },20);
      }
      else if(this.user_type === 'company')
      {

        this.authenticationService.getCurrentCompany(this.currentUser['_creator'])
          .subscribe(
            data =>
            {
              if(data)
              {
                this.is_verify = data['_creator'].is_verify;
                if(this.is_verify == 0)
                {
                  this.success_msg = "not verify";
                }
                else
                {
                  this.success_msg='';
                }
                this.is_admin = data['_creator'].is_admin;
                this.user_name = data['first_name'] +' '+ data['last_name'];
                if(this.is_admin === 1)
                {
                  //this.admin_route = '/admin';
                }
                else
                {
                  this.admin_route = '';
                }
              }
            });
      }
    }
    else
    {
      this.currentUser=null;
      this.user_type='';

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
      this.close = JSON.parse(localStorage.getItem('close_notify'));
    }

  }


  verify_client()
  {
    this.success_msg='';
    this.msg='';

    localStorage.setItem('close_notify', JSON.stringify(this.close));
    if(this.currentUser.email)
    {
      this.authenticationService.verify_client(this.currentUser.email)
        .subscribe(
          data => {
            if(data['success'] === true)
            {
              this.success_msg = "Please check your email to verify your account" ;

              setInterval(() => {
                this.success_msg = "not verify" ;

              }, 12000);

            }

            else
            {
              this.dataservice.changeMessage(data['error']);
              this.log= data['error'];


            }

          },
          error => {
            this.dataservice.changeMessage(error);

          });

    }
    else
    {

    }
  }
  close;
  close_notify()
  {
    this.success_msg='';
    this.close = "close";
    localStorage.setItem('close_notify', JSON.stringify(this.close));

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


    localStorage.removeItem('currentUser');
    localStorage.removeItem('googleUser');
    localStorage.removeItem('close_notify');
    localStorage.removeItem('linkedinUser');
    localStorage.removeItem('admin_log');


  }


}
