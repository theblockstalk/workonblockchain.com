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
  show_popup;
  new_privacy_id;

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

        this.authenticationService.getById(this.currentUser._id)
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
                  //this.admin_route = '/admin';
                }
                else
                {
                  this.admin_route = '';
                }
              }
            });
      }
      else if(this.user_type === 'company')
      {

        this.authenticationService.getCurrentCompany(this.currentUser['_creator'])
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

  update_terms_status(newTermsForm : NgForm){
    console.log(newTermsForm.value);
    if(newTermsForm.valid === true && newTermsForm.value.terms) {
      $("#popModalForTerms").modal("hide");
      let inputQuery : any = {};
      inputQuery.privacy_id = this.new_privacy_id;
      console.log(inputQuery);
      if(this.user_type === 'company'){
        this.authenticationService.edit_company_profile(inputQuery)
        .subscribe(
          data => {
            console.log(data);
          }
        );
      }
      else if(this.user_type === 'candidate'){
        this.authenticationService.edit_candidate_profile(this.currentUser['_creator'],inputQuery,false)
        .subscribe(
          data => {
            console.log(data);
          }
        );
      }
    }
    else{
      this.terms_log = 'Please accept Privacy notice';
    }
  }

  privacy_pop_show(){
    console.log(this.terms_id);
    console.log(this.privacy_id);
    this.authenticationService.get_page_content('Privacy Notice')
      .subscribe(
        data => {
          if (data) {
            console.log(data);
            this.new_privacy_id = data['_id'];
            if(this.terms_id && !this.privacy_id){
              $("#popModalForTerms").modal("show");
            }
            else if(this.privacy_id && this.privacy_id === this.new_privacy_id) {
              console.log('new privacy_id');
            }
            else {
              if(!this.terms_id && !this.privacy_id) console.log('new user');
              else $("#popModalForTerms").modal("show");
            }
          }
        }
      );
  }

}
