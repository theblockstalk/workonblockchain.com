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

  constructor(private route:ActivatedRoute, private router:Router,private authenticationService: UserService) {
    this.route.queryParams.subscribe(params => {
      this.code =  params['code'];
    });
    if(this.code) {
      console.log(this.code);
      this.passCodeToBE(this.code);
    }
    else {
      this.router.navigate(['/not_found']);
    }

  }
  ngOnInit() {

  }

  passCodeToBE(googleCode) {
    this.authenticationService.createCandidate({google_code : googleCode})
      .subscribe(
        user => {
          if(user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = '/candidate_profile';
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
            this.log = 'Something getting wrong';
          }

        });
  }

}
