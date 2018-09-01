import { Component, OnInit,OnDestroy,Directive } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../user.service';
//import {AlertService} from '../alert.service';
import {User} from '../Model/user';
import { HttpClient } from '@angular/common/http';
import { AuthService } from "angular4-social-login";
import { GoogleLoginProvider } from "angular4-social-login";
import { LinkedInService } from 'angular-linkedin-sdk';
//import { Subscription } from 'rxjs/Subscription';
import { DataService } from "../data.service";
import {NgForm} from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';

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

  constructor(private route: ActivatedRoute,
        private router: Router,
        private authenticationService: UserService,private authService: AuthService,private _linkedInService: LinkedInService,private dataservice: DataService,private titleService: Title,private newMeta: Meta) {
		this.titleService.setTitle('Work on Blockchain | Login');
        //this.code = route.snapshot.params['code'];
       // //console.log(this.code);
        // //console.log(this.code);
        /*if(this.code){
            //console.log('in if');
            this.authenticationService.getByRefrenceCode(this.code)
                .subscribe(
                    data => {
                        //console.log(data);
                        this.ref_msg = data.email+' thinks you should join workonblockchain.com';
                    },
                    error => {
                        //console.log('error');
                        //console.log(error);
                        this.log = error;
                    }
                );
        }*/
      }

  password_message;
  ngOnInit() 
  {
	  this.newMeta.updateTag({ name: 'description', content: 'Login developers' });
	  this.newMeta.updateTag({ name: 'keywords', content: 'login blockchain recruitment developers workonblockchain.com' });
      
      this.password_message='';
	  this.dataservice.ecurrentMessage.subscribe(message => this.error = message);
       setInterval(() => {  
                                this.message = "" ;
                                this.error = '';
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
   login(loginForm: NgForm) 
    {
        this.message='';
        this.type='candidate';
       
        if(this.credentials.email && this.credentials.password)
        {
          this.authenticationService.candidate_login(this.credentials.email, this.credentials.password)
            .subscribe(
                user => {
                //console.log(user);
               
                if(user.type == 'company')
                {
                    
                   //this.router.navigateByUrl('/company_profile');   
                    //window.location.href = '/company_profile';
                    
                    window.location.href = '/candidate-search';
                    
                }
                if(user.type == 'candidate')
                {
                  
                 //this.router.navigateByUrl('/candidate_profile');
                    window.location.href = '/candidate_profile';
              
                    
                }
                
                if(user.error )
                {
                     this.log='';
                    this.reset= "reset";
                    this.password_message ='';
                   // this.log  ="Your email or password is incorrect. If you don't remember your password, please click on here to reset it. ";
                   // this.dataservice.changeMessage(user.error);
                }
               
                },
                error => {
                //console.log(error);
                    this.log = 'Something getting wrong';
                   
                });
        }

        else
        {
            this.reset= "";
            this.log = 'Please fill all fields';
        }

    }

   ngOnDestroy() {
   ////console.log("ngOndesctroy");

    }

    
    signInWithGoogle()
    {
     this.message=''; 
        this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
        this.authService.authState.subscribe((user) => 
        {
       
            this.user = user; 
            ////console.log(user);
            this.data = JSON.stringify(this.user);      
            this.result = JSON.parse(this.data);
            localStorage.setItem('googleUser', JSON.stringify(this.result));
            //this.router.navigate(['/candidate_profile']);
      
        });
        //console.log(this.result);
        if(this.result!='')
        {
             //console.log(this.result);
             this.googleUser = JSON.parse(localStorage.getItem('googleUser'));
            //console.log(this.googleUser);
             this.credentials.email= this.googleUser.email;
             this.credentials.password= '';
             this.credentials.type="candidate";
            
             this.credentials.social_type='GOOGLE';

             this.authenticationService.candidate_login(this.credentials.email, this.credentials.password)
            .subscribe(
                user => {
                //console.log(user);
               
                if(user.error)
                {
                    this.log = user.error;
                  /*//console.log("ifffffffffffff");
                 
                  this.log = 'Credentials not match';
                  this.authenticationService.create(this.credentials)
                  .subscribe(
                  data => 
                  {
                    //console.log(data);
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
                        window.location.href = '/terms-and-condition';

                    }
                  },
                  error => {
                    this.log = error;
                    
                  });*/
              
                    
                }
                else
                {
                   //this.router.navigate(['/candidate_profile']);
                    //
                     //console.log("elseeeeeeeeeeeeee");
                    //this.router.navigate(['/candidate_profile']);
                    window.location.href = '/candidate_profile';
                  //this.router.navigate(['/login']);
                }
                },
                error => {
                //console.log(error);
                  this.log = error;
                   
                });
           
        }
        else
        {
            this.router.navigate(['/login']);
        }
        
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
                       
                        this.credentials.email= this.linkedinUser.emailAddress;
                        this.credentials.password= '';
                        this.credentials.type="candidate";
                        this.credentials.social_type='LINKEDIN';
                        
                        if(this.linkedinUser.emailAddress)
                        {
                        this.authenticationService.candidate_login(this.credentials.email, this.credentials.password)
                        .subscribe(
                        user => {
                          //console.log(user);
               
                          if(user.error)
                          {        
                            //this.router.navigate(['/candidate_profile']);
                            this.password_message='';
                            this.log = 'Credentials not match';
                            this.authenticationService.create(this.credentials)
                            .subscribe(
                            data => {
                                //console.log(data);
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
                                window.location.href = '/terms-and-condition';
                            }
                            },
                            error => {
                            this.log = 'Something getting wrong';
                           
                        });  
                        
                        
                            //this.router.navigate(['/login']);

                          }
                          else
                          {
                            window.location.href = '/candidate_profile';
                        }
                        
                      
                    },
                    error => {
                    //console.log(error);
                    this.log = 'Something getting wrong';
                   
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
                    if(!data['error'])
                    {
                        this.dataservice.changeMessage("Please check your email to reset the password.");
                        this.router.navigate(["/login"]);
                        
                    }

                    else
                    {
                        //this.dataservice.changeMessage(data['error']);
                        this.log= data['error'];
                        
                        
                    }
               
                },
                error => {
                 this.dataservice.changeMessage(error);
                   
                });  
        }
    else
        {
        
        this.log= "Please enter you email";
        
        }
    
 }



}
