import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import { AuthService } from "angular4-social-login";
import { GoogleLoginProvider } from "angular4-social-login";
import { LinkedInService } from 'angular-linkedin-sdk';
import {NgForm} from '@angular/forms';
import { DataService } from "../data.service";

@Component({
  selector: 'app-candidate-form',
  templateUrl: './candidate-form.component.html',
  styleUrls: ['./candidate-form.component.css']
})
export class CandidateFormComponent implements OnInit {
    loading = false;
    returnUrl: string;
    
     data;result;
     user;googleUser;email;linkedinUser;message;
    terms;company_terms;
    code;ref_msg;
    refer_by;
    credentials: any = {};
    constructor(
        private route: ActivatedRoute,
        private router: Router,private dataservice: DataService,
        private authenticationService: UserService,private authService: AuthService,private _linkedInService: LinkedInService
       ) {
        this.code = route.snapshot.params['code'];
        if(this.code){
            console.log('in if');
            //console.log(this.code);
            this.authenticationService.getByRefrenceCode(this.code)
                .subscribe(
                    data => {
                        console.log(data);
                        console.log('data');
                        this.ref_msg = data.email+' thinks you should join workonblockchain.com';
                        this.refer_by = data._id;
                    },
                    error => {
                        console.log('error');
                        console.log(error);
                        this.log = error;
                    }
                );
        } 
    }
 
    ngOnInit() 
    {
        this.dataservice.currentMessage.subscribe(message => this.message = message);
       
        this.authenticationService.logout();

    }
    log = '';
    email_log='';
    password_log=''; 
    pass_log='';

    signup_candidate(loginForm: NgForm) 
    {

          this.credentials.type="candidate";
          this.credentials.social_type='';
        console.log(this.refer_by);
        if(!this.credentials.email)
        {
            this.email_log="can't be blank";
        }
        else
        {
            this.email_log="";
        }

        if(this.credentials.password != this.credentials.confirm_password )
        {
            this.password_log = "doesn't match Password";
        }
        else
        {
            this.password_log="";
        }

        if(!this.credentials.password )
        {
            this.pass_log="can't be blank";
        }
        else
        {
             this.pass_log="";
        }
        if(this.credentials.email && this.credentials.password && this.credentials.confirm_password && this.credentials.password == this.credentials.confirm_password)
        {
            this.authenticationService.create(this.credentials)
            .subscribe(
                data => 
                {
                   
                    //console.log(data);
                    if(data.error)
                    {
                        this.log = data.error;
                    }

                    else
                    {
                       localStorage.setItem('currentUser', JSON.stringify(data));
                       //console.log("elseeee");
                        this.authenticationService.refered_id(this.refer_by , data._creator)
                        .subscribe(
                        data => 
                        {
                           // console.log(data);
                            if(data.error)
                            {
                                this.log = 'Something getting wrong';
                            }
                            else
                            {
                                 window.location.href = '/about';
                            }
                            
                        });
                        //localStorage.removeItem('userInfo');
                        //this.router.navigate(['/about']);
                       // window.location.href = '/about';
                    }
                },
                error => 
                {
                    this.log = 'Something getting wrong';
                    this.loading = false;
                });
      

        }

    }
    
    signInWithGoogle()
    {
        this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
        this.authService.authState.subscribe((user) => 
        {
       
            this.user = user; 
            //console.log(user);
            this.data = JSON.stringify(this.user);      
            this.result = JSON.parse(this.data);
            localStorage.setItem('googleUser', JSON.stringify(this.result));
      
        });
        //console.log(this.result);
        if(this.result!='')
        {
            console.log(this.result);
             this.googleUser = JSON.parse(localStorage.getItem('googleUser'));
             this.credentials.email= this.googleUser.email;
             this.credentials.password= '';
             this.credentials.type="candidate";
             this.credentials.social_type=this.googleUser.provider;
            this.authenticationService.create(this.credentials)
            .subscribe(
                data => {
                console.log(data);
                 this.credentials.email= '';
                if(data.error)
                    {
                        this.log = data.error;
                    }
                    else
                    {
                        localStorage.setItem('currentUser', JSON.stringify(data));
                        //localStorage.removeItem('userInfo');
                        //this.router.navigate(['/about']);
                        window.location.href = '/about';
                    }
                },
                error => {
                    this.log = 'Something getting wrong';
                    this.loading = false;
                });
        }
        else
        {
            this.router.navigate(['/signup']);
        }
        
    }

    public subscribeToLogin()
    {
        this._linkedInService.login().subscribe({
        next: (state) => 
        {
            const url = '/people/~:(id,picture-url,location,industry,positions,specialties,summary,email-address )?format=json';
            this._linkedInService.raw(url).asObservable().subscribe({
                next: (data) => {
                    console.log(data);
                    localStorage.setItem('linkedinUser', JSON.stringify(data));
                    if(data)
                    {
                        this.linkedinUser = JSON.parse(localStorage.getItem('linkedinUser'));
                       
                        this.credentials.email= this.linkedinUser.emailAddress;
                        this.credentials.password= '';
                        this.credentials.type="candidate";
                        this.credentials.social_type='LINKKEDIN';

                        this.authenticationService.create(this.credentials)
                        .subscribe(
                            data => {
                                console.log(data);
                                this.credentials.email= '';
                            if(data.error)
                            {
                                this.log = data.error;
                            }
                            else
                            {
                                localStorage.setItem('currentUser', JSON.stringify(data));
                                //localStorage.removeItem('userInfo');
                                //this.router.navigate(['/about']);
                                window.location.href = '/about';
                            }
                            },
                            error => {
                            this.log = 'Something getting wrong';
                            this.loading = false;
                        });  
                    }
                },
                error: (err) => {
                    console.log(err);
                },
                complete: () => {
                    console.log('RAW API call completed');
                }
            });
        },
        complete: () => {
      // Completed
        }
        });
    }


    company_signup(signupForm: NgForm) 
    {
            console.log("comapny signup form");
            this.credentials.type="company";
            this.credentials.social_type='';
            if(this.credentials.password != this.credentials.confirm_password )
            {
                this.credentials.password = '';
                this.credentials.confirm_password = '';
                this.password_log = "doesn't match Password";
            }
            else
            {
				console.log('else');
                this.authenticationService.create_employer(this.credentials)
                .subscribe(
                data => 
                {
                    console.log(data);
                    if(data.error)
                    {
                        this.dataservice.changeMessage(data.error);
                        this.log = data.error;
                    }

                    else
                    {
                        localStorage.setItem('currentUser', JSON.stringify(data));
                        //console.log(localStorage.getItem('currentUser'));
                        //localStorage.removeItem('userInfo');
                        //this.router.navigate(['/company_profile']);
                        window.location.href = '/company_profile';
                    }
                },
                error => 
                {
                    //console.log(error);
                    this.log = 'Something getting wrong';
                    this.loading = false;
                });
            }
    }

  

}
