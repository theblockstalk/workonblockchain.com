import { Component, OnInit,OnDestroy,Directive } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { DataService } from '../../data.service';
import {NgForm} from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import {environment} from '../../../environments/environment';

const URL = environment.backend_url;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  credentials: any = {};
  log = '';
  currentUser: User;
  type;
  user;data;result;googleUser;linkedinUser;
  code;
  button_status = '';
  public isUserAuthenticatedEmittedValue = false;
  public isUserAuthenticated;
  message:string;
  error;
  forgetMessage;
  constructor(private http: HttpClient , private route: ActivatedRoute,
              private router: Router,
              private authenticationService: UserService,private dataservice: DataService,private titleService: Title,private newMeta: Meta) {
    this.titleService.setTitle('Work on Blockchain | Login');

  }

  password_message;
  response;
  google_url;
  linkedin_url;
  ngOnInit()
  {

    this.response = "empty";
    this.newMeta.updateTag({ name: 'description', content: 'Login developers' });
    this.newMeta.updateTag({ name: 'keywords', content: 'login blockchain recruitment developers workonblockchain.com' });
    this.dataservice.forgetMessage.subscribe(message => this.forgetMessage = message);
    this.password_message='';
    this.dataservice.ecurrentMessage.subscribe(message => this.error = message);
    setInterval(() => {
      this.message = "" ;
      this.error = '';
      this.forgetMessage='';
    }, 15000);

    setInterval(() => {
      //this.log='';
    }, 30000);
    localStorage.removeItem('currentUser');
    this.password_message = JSON.parse(localStorage.getItem('password_change_msg'));
    localStorage.removeItem('password_change_msg');

    localStorage.removeItem('jwt_not_found');

  }
  reset;
  previousUrl;
  login(loginForm: NgForm)
  {
    this.button_status="submit";
    this.message='';
    this.type='candidate';
    this.response = 'process';
    if(this.credentials.email && this.credentials.password)
    {
      this.authenticationService.candidate_login({email : this.credentials.email, password : this.credentials.password})
        .subscribe(
          user => {

            if(user['type'] === 'company') {
              this.response = 'data';
              this.previousUrl = localStorage.getItem('previousUrl');

              if(this.previousUrl) {
                window.location.href = '/' + this.previousUrl;
              }
              else {
                if (new Date(user['created_date']) < new Date('2018/11/28')) {
                  window.location.href = '/candidate-search';
                }
                else {
                  window.location.href = '/candidate-search';

                }
              }

            }
            if(user['type'] === 'candidate')
            {
              window.location.href = '/users/talent';
            }

          },
          error => {
            this.response = 'error';
            if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              this.password_message = '';
              this.log = error['error']['message'];
            }
            else if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              this.password_message = '';
              this.log = error['error']['message'];
            }
            else {
              this.log = 'Something went wrong';
            }

          });
    }

    else
    {
      this.reset= "";
      this.log = 'Please fill all fields';
    }

  }

  ngOnDestroy() {

  }

  signInWithGoogle()
  {
    localStorage.setItem('googleLogin', 'true');
    let google_id = environment.google_client_id;
    let google_redirect_url = environment.google_redirect_url;
    this.google_url='https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&prompt=consent&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fplus.profile.emails.read%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fplus.login&response_type=code&client_id='+google_id+'&redirect_uri='+google_redirect_url;
    window.location.href = this.google_url;
  }

  loginWithLinkedin() {
    localStorage.setItem('linkedinLogin', 'true');
    let linkedin_id = environment.linkedin_id;
    let linkedin_redirect_url = environment.linkedin_redirect_url;
    this.linkedin_url = 'https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id='+linkedin_id+'&state=4Wx72xl6lDlS34Cs&redirect_uri='+linkedin_redirect_url+'&scope=r_liteprofile%20r_emailaddress';
    window.location.href = this.linkedin_url;
  }


  reset_passsword()
  {
    this.reset='';
    this.password_message='';
    if(this.credentials.email)
    {
      this.authenticationService.forgot_password(this.credentials.email)
        .subscribe(
          data => {

            this.dataservice.changeMessage("Please check your email to reset the password.");
            this.router.navigate(["/login"]);


          },
          error => {
            if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              this.password_message = '';
              this.log = error['error']['message'];
            }
            else if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              this.password_message = '';
              this.log = error['error']['message'];
            }
            else {
              this.log = 'Something went wrong';
            }

          });
    }
    else
    {

      this.log= "Please enter you email";

    }

  }


}
