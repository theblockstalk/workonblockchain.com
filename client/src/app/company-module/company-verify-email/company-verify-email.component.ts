import { Component, OnInit, Inject } from '@angular/core';
import {UserService} from "../../user.service";
import { Router } from '@angular/router';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';

@Component({
  selector: 'app-company-verify-email',
  templateUrl: './company-verify-email.component.html',
  styleUrls: ['./company-verify-email.component.css']
})
export class CompanyVerifyEmailComponent implements OnInit {
  currentUser: any;
  success_msg;
  error_msg;

  constructor(@Inject(LOCAL_STORAGE) private localStorage: any, private authenticationService: UserService , private router: Router) { }

  ngOnInit() {
    this.currentUser = JSON.parse(this.localStorage.getItem('currentUser'));
    if(this.currentUser) {}
    else  this.router.navigate(['/company-verify-email']);
  }
  verify_client()
  {
    if(this.currentUser.email)
    {
      this.authenticationService.verify_client(this.currentUser.email)
        .subscribe(
          data => {
            if(data['success'] === true)
            {
              this.success_msg = "Please check your email to verify your account." ;
              setInterval(() => {
                this.success_msg = "" ;
              }, 5000);
            }
            else
            {
              this.error_msg= data['error'];


            }

          },
          error => {

          });

    }
    else
    {

    }
  }
}
