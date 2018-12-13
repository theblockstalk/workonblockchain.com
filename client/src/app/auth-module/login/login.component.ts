import { Component, OnInit,OnDestroy,Directive } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { AuthService } from 'angular4-social-login';
import { GoogleLoginProvider } from 'angular4-social-login';
import { LinkedInService } from 'angular-linkedin-sdk';
import { DataService } from '../../data.service';
import {NgForm} from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import {environment} from '../../../environments/environment';
import { map } from 'rxjs/operators';

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
  code; ref_msg;

  message:string;
  error;
  forgetMessage;
  constructor(private http: HttpClient , private route: ActivatedRoute,
              private router: Router,
              private authenticationService: UserService,private authService: AuthService,private _linkedInService: LinkedInService,private dataservice: DataService,private titleService: Title,private newMeta: Meta) {
    this.titleService.setTitle('Work on Blockchain | Login');

  }

  password_message;
  ngOnInit()
  {
    this.newMeta.updateTag({ name: 'description', content: 'Login developers' });
    this.newMeta.updateTag({ name: 'keywords', content: 'login blockchain recruitment developers workonblockchain.com' });
    this.dataservice.forgetMessage.subscribe(message => this.forgetMessage = message);
    this.password_message='';
    this.dataservice.ecurrentMessage.subscribe(message => this.error = message);
    setInterval(() => {
      this.message = "" ;
      this.error = '';
      this.forgetMessage='';
      this.log='';
    }, 12000);
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.password_message = JSON.parse(localStorage.getItem('password_change_msg'));
    localStorage.removeItem('password_change_msg');


    this.error = localStorage.getItem('jwt_not_found');
    localStorage.removeItem('jwt_not_found');

  }
  reset;
  previousUrl;
  login(loginForm: NgForm)
  {
    this.message='';
    this.type='candidate';

    if(this.credentials.email && this.credentials.password)
    {
      this.authenticationService.candidate_login(this.credentials.email, this.credentials.password, null)
        .subscribe(
          user => {

            if(user['type'] === 'company') {
              this.previousUrl = localStorage.getItem('previousUrl');

              if(this.previousUrl) {
                window.location.href = '/' + this.previousUrl;
              }
              else {
                if (new Date(user['created_date']) < new Date('2018/11/28')) {
                  this.http.get<any>(URL + 'users/current_company/' + user['_id'], {
                    headers: new HttpHeaders().set('Authorization', user['jwt_token'])
                  }).pipe(map(res =>
                  {
                      if (!res.saved_searches) {
                        window.location.href = '/company_profile';
                      }
                      else {
                        window.location.href = '/candidate-search';

                      }
                    }));
                }
                else {
                  window.location.href = '/candidate-search';

                }
              }

            }
            if(user['type'] === 'candidate')
            {
              window.location.href = '/candidate_profile';
            }

          },
          error => {
            if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              this.password_message = '';
              this.log = error['error']['message'];
            }
            else if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              this.password_message = '';
              this.log = error['error']['message'];
            }
            else {
              this.log = 'Something getting wrong';
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

  dataa;
  signInWithGoogle()
  {
    this.message='';
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.authService.authState.subscribe((user) =>
    {

      this.user = user;
      this.data = JSON.stringify(this.user);
      this.result = JSON.parse(this.data);
      localStorage.setItem('googleUser', JSON.stringify(this.result));

      if(this.result)
      {
        this.googleUser = JSON.parse(localStorage.getItem('googleUser'));
        this.credentials.email= this.googleUser.email;
        this.credentials.password= '';
        this.credentials.type="candidate";

        this.credentials.social_type='GOOGLE';

        this.authenticationService.candidate_login(this.credentials.email, this.credentials.password , null)
          .subscribe(
            user => {

              window.location.href = '/candidate_profile';
              //this.router.navigate(['/login']);

            },
            error => {
              if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
                this.password_message = '';
                this.log = error['error']['message'];
              }
              else if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
                this.password_message = '';
                this.log = error['error']['message'];
              }
              else {
                this.log = 'Something getting wrong';
              }

            });

      }
      else
      {
        this.router.navigate(['/login']);
      }
      //this.router.navigate(['/candidate_profile']);

    });
    //console.log(this.result);


  }

  public subscribeToLogin()
  {
    this.message='';
    this._linkedInService.login().subscribe({
      next: (state) =>
      {
        const url = '/people/~:(id,picture-url,location,industry,positions,specialties,summary,email-address)?format=json';
        this._linkedInService.raw(url).asObservable().subscribe({
          next: (data) => {
            //console.log(data);
            localStorage.setItem('linkedinUser', JSON.stringify(data));
            if(data)
            {
              this.linkedinUser = JSON.parse(localStorage.getItem('linkedinUser'));

              this.credentials.email = this.linkedinUser.emailAddress;
              this.credentials.password= '';
              this.credentials.type="candidate";
              this.credentials.social_type='LINKEDIN';
              this.credentials.linkedin_id = this.linkedinUser.id;


              if(this.linkedinUser.emailAddress)
              {
                this.authenticationService.candidate_login(this.credentials.email, this.credentials.password, this.credentials.linkedin_id)
                  .subscribe(
                    user => {

                      window.location.href = '/candidate_profile';

                    },
                    error => {
                      if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
                        this.password_message = '';
                        this.log = error['error']['message'];
                      }
                      else if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
                        this.password_message = '';
                        this.log = error['error']['message'];
                      }
                      else {
                        this.log = 'Something getting wrong';
                      }

                    });
              }

              else
              {
                this.log = 'Something getting wrong';
              }
            }
            else
            {
              this.router.navigate(['/login']);
            }
          },
          error: (err) => {
            //console.log(err);
          },
          complete: () => {
            //console.log('RAW API call completed');
          }
        });
      },
      complete: () => {
        // Completed
      }
    });
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
            //console.log(data);

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
              this.log = 'Something getting wrong';
            }

          });
    }
    else
    {

      this.log= "Please enter you email";

    }

  }



}
