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
    countries = ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua & Deps', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Rep', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Congo {Democratic Rep}', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland {Republic}', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea North', 'Korea South', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar, {Burma}', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russian Federation', 'Rwanda', 'St Kitts & Nevis', 'St Lucia', 'Saint Vincent & the Grenadines', 'Samoa', 'San Marino', 'Sao Tome & Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad & Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'];

    constructor(
        private route: ActivatedRoute,
        private router: Router,private dataservice: DataService,
        private authenticationService: UserService,private authService: AuthService,private _linkedInService: LinkedInService
       ) {
		this.route.queryParams.subscribe(params => {
			this.code = params['code'];   
		});
		
        if(this.code){
            //console.log('in if');
            this.authenticationService.getByRefrenceCode(this.code)
                .subscribe(
                    data => {
                        //console.log(data);
                        //console.log('data');
                        this.ref_msg = data.email+' thinks you should join workonblockchain.com';
                        this.credentials.refer_by = data._id;
                    },
                    error => {
                        //console.log('error');
                        //console.log(error);
                        this.log = error;
                    }
                );
        } 
	}
 ngOnDestroy() {
   //console.log("ngOndesctroy");
    }
 
    ngOnInit() 
    {
        this.credentials.email='';
        
        this.credentials.country=-1;
        this.dataservice.currentMessage.subscribe(message => this.message = message);
         setInterval(() => {  
                                this.message = "" ;
                                this.log='';
                        }, 8000);
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
        //console.log(this.refer_by);
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
            this.password_log = "Password do not match";
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
                   
                    ////console.log(data);
                    if(data.error)
                    {
                        this.log = data.error;
                    }

                    else
                    {
                       localStorage.setItem('currentUser', JSON.stringify(data));
                      
                        window.location.href = '/terms-and-condition';
                        
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
            ////console.log(user);
            this.data = JSON.stringify(this.user);      
            this.result = JSON.parse(this.data);
            localStorage.setItem('googleUser', JSON.stringify(this.result));      
            //console.log(this.result);
      
        });
        ////console.log(this.result);
        if(this.result!='')
        {
            //console.log(this.result);
             this.googleUser = JSON.parse(localStorage.getItem('googleUser'));
             this.credentials.email= this.googleUser.email;
             this.credentials.password= '';
             this.credentials.type="candidate";
             this.credentials.social_type=this.googleUser.provider;
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
                            this.loading = false;
                        });  
                            }
                        else
                            {
                                this.log = 'Something getting wrong';
                            }
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


    company_signup(signupForm: NgForm) 
    {
            //console.log("comapny signup form");
            this.credentials.type="company";
            this.credentials.social_type='';
            if(this.credentials.password != this.credentials.confirm_password )
            {
                this.credentials.password = '';
                this.credentials.confirm_password = '';
                this.password_log = "Password do not match";
            }
            else
            {
				//console.log('else');
                this.authenticationService.create_employer(this.credentials)
                .subscribe(
                data => 
                {
                    //console.log(data);
                    if(data.error)
                    {
                        this.dataservice.changeMessage(data.error);
                        this.log = data.error;
                    }

                    else
                    {
                        localStorage.setItem('currentUser', JSON.stringify(data));
                        ////console.log(localStorage.getItem('currentUser'));
                        //localStorage.removeItem('userInfo');
                        //this.router.navigate(['/company_wizard']);
                        window.location.href = '/company_wizard';
                    }
                },
                error => 
                {
                    ////console.log(error);
                    this.log = 'Something getting wrong';
                    this.loading = false;
                });
            }
    }

  

}
