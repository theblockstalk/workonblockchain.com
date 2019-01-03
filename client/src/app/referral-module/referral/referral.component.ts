import { Component, OnInit,ElementRef, AfterViewInit, Input, ViewChild } from '@angular/core';
import {NgForm} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
import {ProfileDetail} from '../../Model/ProfileDetail';
import { HttpClient } from '@angular/common/http';
import { Title, Meta } from '@angular/platform-browser';
import {environment} from '../../../environments/environment';
const URL = environment.frontend_url;
declare var $: any;

@Component({
  selector: 'app-referral',
  templateUrl: './referral.component.html',
  styleUrls: ['./referral.component.css']
})
export class ReferralComponent implements OnInit {
  currentUser: User;
  @ViewChild('element') element: ElementRef;
  credentials: any = {};
  email_ref_link = URL + 'refer?code=';
  log = '';
  title = 'My Ref Page';
  ref_link = '';
  email_subject = ' thinks that you should Work on Blockchain!';
  mail_body = '';
  show_refreal;
  display_name;
  share_url;
  text;
  first_name;
  last_name;
  ref_link_for_not_logged_user = '';
  termscondition = false;
  terms_log = '';
  log_success = '';
  twitterText;

  constructor(
    private authenticationService: UserService,private titleService: Title,private newMeta: Meta
  ) {
    this.titleService.setTitle('Work on Blockchain | £500 reward for referrals');
    this.twitterText = 'Start your career in the exciting and breakthrough area of blockchain \n\n';
    const url2 = 'https://platform.twitter.com/widgets.js';
    if (!document.querySelector(`script[src='${url2}']`)) {
      let script = document.createElement('script');
      script.src = url2;
      document.body.appendChild(script);
    }
  }

  ngAfterViewInit(): void {
    window['twttr'] && window['twttr'].widgets.load();
  }

  ngOnInit(){
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = 'https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v3.0';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
    this.newMeta.updateTag({ name: 'description', content: 'Refer a friend to workonblockchain.com, the blockchain recruitment platform for developers, and get £500 when they are successfully employed by a company through the platform.' });
    this.newMeta.updateTag({ name: 'keywords', content: 'refer developer referral reward workonblockchain.com' });

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.show_refreal = 1;
    if(this.currentUser && this.currentUser.type === 'candidate'){
      this.show_refreal = 10;
      this.authenticationService.getById(this.currentUser._creator)
        .subscribe(
          data => {
            if(data) {
              this.first_name = data['first_name'];
              this.last_name = data['last_name'];
              this.display_name = data['first_name'] +' '+ data['last_name'];
              this.authenticationService.getRefCode(data['_creator'].email)
                .subscribe(
                  data => {
                    this.ref_link = this.email_ref_link + data['url_token'];
                    this.mail_body = 'Hi, \n\nYou have been invited by '+this.display_name+' to join Work on Blockchain. \n\nIt takes seconds to sign up. Work on Blockchain is the easiest way to secure a job in the blockchain space. \n\nGive us a try! \n\nCreate a profile and have blockchain companies apply to you by following this link '+this.ref_link+' \n \nCompanies looking to hire are able to search and directly contact the professionals that they want through the platform! \n \nThanks, \nWork on Blockchain team!';
                    this.email_subject = this.first_name+this.email_subject;
                    this.share_url = this.ref_link;
                    this.text = this.twitterText + this.share_url;
                    //this.text = 'Sign up to Work on Blockchain by clicking here ' + this.share_url + ' and have companies apply to you! Follow @work_blockchain #workonblockchain #blockchain #hiring #talent' ;
                  },
                  error => {
                  });
            }

          },
          error => {
          }
        );
    }

    if(this.currentUser && this.currentUser.type === 'company'){
      this.show_refreal = 10;
      this.authenticationService.getCurrentCompany(this.currentUser._creator)
        .subscribe(
          data => {
            if(data) {
              console.log(data);
              this.first_name = data['first_name'];
              this.last_name = data['last_name'];
              this.display_name = data['first_name']+ ' '+ data['last_name'];
              console.log(this.display_name);
              console.log(data['_creator']['email']);
              this.authenticationService.getRefCode(data['_creator']['email'])
                .subscribe(
                  refLink => {
                    console.log(refLink);
                    this.ref_link = this.email_ref_link + refLink['url_token'];
                    this.mail_body = 'Hi, \n\nYou have been invited by '+this.display_name+' to join Work on Blockchain. \n\nIt takes seconds to sign up. Work on Blockchain is the easiest way to secure a job in the blockchain space. \n\nGive us a try! \n\nCreate a profile and have blockchain companies apply to you by following this link '+this.ref_link+' \n \nCompanies looking to hire are able to search and directly contact the professionals that they want through the platform! \n \nThanks, \nWork on Blockchain team!';
                    this.email_subject = this.first_name+this.email_subject;
                    this.share_url = this.ref_link;
                    this.text = this.twitterText + this.share_url;
                    //this.text = 'Sign up to Work on Blockchain by clicking here ' + this.share_url + ' and have companies apply to you! Follow @work_blockchain #workonblockchain #blockchain #hiring #talent' ;
                  },
                  error => {
                    console.log(error);

                  });
            }

          },
          error => {

          }
        );
        }

  }

  send_email() {
    if(this.credentials.email && this.email_subject && this.mail_body){
      this.log = '';
      this.log_success = 'Sending your Email';
      this.authenticationService.send_refreal(this.credentials.email, this.email_subject, this.mail_body,this.share_url,this.first_name,this.last_name)
      .subscribe(
        data => {
          this.log_success = data['msg'];
        },
        error => {
          if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false)
          {
            this.log = error['error']['message'];
          }
          else if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false)
          {
            this.log = error['error']['message'];
          }
          else{
            this.log = error['error']['message'];
          }
        }
      );
    }
    else{
      this.log_success = '';
        this.log = 'Please fill all fields';
    }
  }
  copyInputMessage(inputElement){
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }

  get_ref_link(refrealForm : NgForm){
    this.terms_log = '';
    if(refrealForm.value.email && refrealForm.value.terms) {
      this.termscondition = refrealForm.value.terms;
      this.authenticationService.getRefCode(refrealForm.value.email)
      .subscribe(
        data => {
          if(data) {
            this.ref_link_for_not_logged_user = this.email_ref_link + data['url_token'];
            this.share_url = this.ref_link_for_not_logged_user;
            this.text = 'Sign up to Work on Blockchain by clicking here ' + this.share_url + ' and have companies apply to you! Follow @work_blockchain #workonblockchain #blockchain #hiring #talent' ;
          }
          },
        error => {}

      );
    }
    else{
      if(!refrealForm.value.terms){
        this.terms_log = "Please accept terms and conditions";
      }
      if(!refrealForm.value.email){
        this.terms_log = "Please enter your email";
      }
      this.ref_link_for_not_logged_user = '';
    }
  }
}
