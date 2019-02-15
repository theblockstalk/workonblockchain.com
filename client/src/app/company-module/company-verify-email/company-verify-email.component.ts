import { Component, OnInit } from '@angular/core';
import {UserService} from "../../user.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-verify-email',
  templateUrl: './company-verify-email.component.html',
  styleUrls: ['./company-verify-email.component.css']
})
export class CompanyVerifyEmailComponent implements OnInit {
  currentUser: any;
  success_msg;
  error_msg;

  constructor(private authenticationService: UserService , private router: Router) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(this.currentUser) {}
    else  this.router.navigate(['/company-verify-email']);
  }
  verify_client()
  {
    if(this.currentUser.email)
    {
      console.log("if");
      this.authenticationService.verify_client(this.currentUser.email)
        .subscribe(
          data => {
            console.log(data)
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
