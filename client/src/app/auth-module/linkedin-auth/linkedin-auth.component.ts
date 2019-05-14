import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import { LOCAL_STORAGE, WINDOW } from '@ng-toolkit/universal';

@Component({
  selector: 'app-linkedin-auth',
  templateUrl: './linkedin-auth.component.html',
  styleUrls: ['./linkedin-auth.component.css']
})
export class LinkedinAuthComponent implements OnInit {

  code;
  log;
  linkedinUser;
  previousUrl;
  constructor(@Inject(WINDOW) private window: Window, @Inject(LOCAL_STORAGE) private localStorage: any, private route:ActivatedRoute, private router:Router,private authenticationService: UserService) {
    this.linkedinUser = (localStorage.getItem('linkedinLogin'));

    this.route.queryParams.subscribe(params => {
      this.code =  params['code'];
    });
    if(this.code && this.linkedinUser === 'true') {
      this.login(this.code);
    }
    else if(this.code && !this.linkedinUser) {
      this.passCodeToBE(this.code);
    }
    else {
      this.router.navigate(['/not_found']);
    }
  }

  ngOnInit() {


  }
  login(code) {
    this.localStorage.removeItem('linkedinLogin');

    this.authenticationService.candidate_login({linkedin_code : code})
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
            this.log = 'There was a problem with your linkedin identity';
          }

        });
  }

  passCodeToBE(code) {
    this.authenticationService.createCandidate({linkedin_code : code})
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
            this.log = 'There was a problem with your linkedin identity';
          }

        });
  }

}
