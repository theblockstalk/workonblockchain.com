import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import { HttpClient } from '@angular/common/http';
import {NgForm} from '@angular/forms';
import { DataService } from '../../data.service';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  message;
  log;
  data:any;
  email;

  constructor(private route: ActivatedRoute, private http: HttpClient,
              private router: Router,
              private authenticationService: UserService,private dataservice: DataService) {

  }

  ngOnInit() {

  }

  forgot_password(f: NgForm)
  {
    if(!f.value.email){
      this.log = 'Please enter your email';
    }
    else {
      this.authenticationService.forgot_password(f.value.email)
      .subscribe(
        data => {

          this.dataservice.forgertMessage("Please check your email to reset the password.");
          this.router.navigate(["/login"]);

        },
        error => {
          if (error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
            this.dataservice.changeMessage(error['error']['message']);
            this.log = error['error']['message'];
          }
          else if (error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
            this.dataservice.changeMessage(error['error']['message']);
            this.log = error['error']['message'];
          }
          else {
            this.dataservice.changeMessage('Something went wrong');
            this.log = "Something went wrong";
          }

        });
    }
  }
}
