import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { DatePipe } from '@angular/common';
import { DataService } from "../data.service";
import {NgForm} from '@angular/forms';
declare var $: any;

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
  user_name = 'Admin';
  log;
  success;
  success_msg;
  location;
  privacy_id;
  terms_id;
  termscondition = false;
  terms_log;
  page_name;
  new_terms_id;
  agree;

  constructor(private authenticationService: UserService,private dataservice: DataService,private router: Router,location: Location,private datePipe: DatePipe)
  {
    this.success_msg='';
    this.admin_route = window.location.pathname;
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

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if(this.currentUser )
    {
      this.user_type = this.currentUser.type;

      if(this.user_type === 'candidate')
      {
        this.page_name = 'Terms and Condition for candidate';
        this.authenticationService.getCandidateProfileById(this.currentUser._id, false)
          .subscribe(
            data =>
            {

              if(data)
              {
                this.terms_id = data['candidate']['terms_id'];
                this.privacy_id = data['candidate']['privacy_id'];
                this.privacy_pop_show();

                this.is_verify = data['is_verify'];
                if(this.is_verify == 0)
                {
                  this.success_msg = "not verify";
                }
                else
                {
                  this.success_msg='';
                }
                this.is_admin = data['is_admin'];
                this.user_name = data['first_name'] +' '+ data['last_name'];
                if(this.is_admin === 1)
                {
                  localStorage.setItem('admin_log', JSON.stringify(data));
                }
                else
                {
                  localStorage.removeItem('admin_log');
                  this.admin_route = '';
                }
              }
            });
      }
      else if(this.user_type === 'company')
      {
        this.page_name = 'Terms and Condition for company';
        this.authenticationService.getCurrentCompany(this.currentUser._id, false)
          .subscribe(
            data =>
            {
              if(data)
              {
                this.terms_id = data['terms_id'];
                this.privacy_id = data['privacy_id'];
                this.privacy_pop_show();

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
                  localStorage.setItem('admin_log', JSON.stringify(data['_creator']));
                }
                else
                {
                  localStorage.removeItem('admin_log');
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

  update_terms_status(newTermsForm : NgForm){
    if(newTermsForm.valid === true && newTermsForm.value.terms) {
      let inputQuery : any = {};
      inputQuery.terms_id = this.new_terms_id;
      this.authenticationService.update_terms_and_privacy(inputQuery)
      .subscribe(
        data => {
          $("#popModalForTerms").modal("hide");
        },
        error=>
        {
          if(error['status'] === 404 && error['error']['message'])
          {
            console.log(error);
            this.terms_log = 'something getting wrong';
          }
        }
      );
    }
    else{
      this.terms_log = 'Please accept Terms of Business';
    }
  }

  privacy_pop_show(){
    if(this.terms_id) {
      this.authenticationService.get_page_content(this.page_name)
      .subscribe(
        data => {
          if (data) {
            this.new_terms_id = data['_id'];
            if (this.new_terms_id && this.new_terms_id === this.terms_id) {
              //console.log('new terms_id');
            }
            else $("#popModalForTerms").modal("show");
          }
        }
      );
    }
  }

}
