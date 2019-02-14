import { Component, OnInit } from '@angular/core';
import {UserService} from "../../user.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-candidate-verify-email',
  templateUrl: './candidate-verify-email.component.html',
  styleUrls: ['./candidate-verify-email.component.css']
})
export class CandidateVerifyEmailComponent implements OnInit {
  currentUser: any;
  success_msg;
  error_msg;

  constructor(private authenticationService: UserService , private router: Router) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(this.currentUser) {}
    else  this.router.navigate(['/not_found']);
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
              this.success_msg = "Please check your email to verify your account" ;

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
