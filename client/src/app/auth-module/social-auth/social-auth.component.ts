import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import { LOCAL_STORAGE, WINDOW } from '@ng-toolkit/universal';

@Component({
  selector: 'app-social-auth',
  templateUrl: './social-auth.component.html',
  styleUrls: ['./social-auth.component.css']
})
export class SocialAuthComponent implements OnInit {

  code;
  log;
  googleUser;
  constructor(@Inject(WINDOW) private window: Window, @Inject(LOCAL_STORAGE) private localStorage: any, private route:ActivatedRoute, private router:Router,private authenticationService: UserService) {
    this.googleUser = (localStorage.getItem('googleLogin'));

    this.route.queryParams.subscribe(params => {
      this.code =  params['code'];
    });
    if(this.code && this.googleUser === 'true') {
      console.log(this.code);
      this.login(this.code);
    }
    else if(this.code && !this.googleUser) {
      console.log(this.code);
      this.passCodeToBE(this.code);
    }
    else {
      this.router.navigate(['/not_found']);
    }

  }
  ngOnInit() {

  }

  login(code) {
    this.localStorage.removeItem('googleLogin');

    this.authenticationService.candidate_login({google_code : code})
      .subscribe(
        user => {

          if(user) {
            this.window.location.href = '/candidate_profile';
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
    this.authenticationService.createCandidate({google_code : googleCode})
      .subscribe(
        user => {
          if(user) {
            this.localStorage.setItem('currentUser', JSON.stringify(user));
            this.window.location.href = '/candidate_profile';
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
