import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';

@Component({
  selector: 'app-social-auth',
  templateUrl: './social-auth.component.html',
  styleUrls: ['./social-auth.component.css']
})
export class SocialAuthComponent implements OnInit {

  code;
  log;
  googleUser;
  referred_email;
  refcode;
  constructor(private route:ActivatedRoute, private router:Router,private authenticationService: UserService) {
    this.refcode = localStorage.getItem('ref_code');
    if (this.refcode) {
      this.authenticationService.getByRefrenceCode(this.refcode)
        .subscribe(
          data => {
            if (data) {
              this.referred_email = data['email'];
              this.getParam();
            }
          },
          error => {
          }
        );
    }
    else {
      this.getParam();
    }
  }
  getParam() {
    this.googleUser = (localStorage.getItem('googleLogin'));

    this.route.queryParams.subscribe(params => {
      this.code =  params['code'];
    });
    if(this.code && this.googleUser === 'true') {
      this.login(this.code);
    }
    else if(this.code && !this.googleUser) {
      this.passCodeToBE(this.code);
    }
    else {
      this.router.navigate(['/not_found']);
    }
  }

  ngOnInit() {

  }

  login(code) {
    localStorage.removeItem('googleLogin');
    this.authenticationService.candidate_login({google_code : code})
      .subscribe(
        user => {

          if(user) {
            window.location.href = '/talent/view';
          }

        },
        error => {
          this.log = 'error';
          if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
            this.log = error['error']['message'];
          }
          else if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
            this.log = error['error']['message'];
          }
          else{
            this.log = 'There was a problem with your google identity';
          }

        });
  }


  passCodeToBE(googleCode) {
    let queryBody : any = {};
    if(this.referred_email) queryBody.referred_email = this.referred_email;
    queryBody.google_code = googleCode;
    this.authenticationService.createCandidate(queryBody)
      .subscribe(
        user => {
          if(user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = '/talent/view';
          }

        },
        error => {
          if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
            this.log = error['error']['message'];
          }
          else if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
            this.log = error['error']['message'];
          }
          else {
            this.log = 'There was a problem with your google identity';
          }


        });
  }

}
