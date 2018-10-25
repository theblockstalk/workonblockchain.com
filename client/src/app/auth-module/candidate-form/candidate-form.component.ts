import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import { AuthService } from "angular4-social-login";
import { GoogleLoginProvider } from "angular4-social-login";
import { LinkedInService } from 'angular-linkedin-sdk';
import {NgForm} from '@angular/forms';
import { DataService } from "../../data.service";
import { Title, Meta } from '@angular/platform-browser';
declare var $: any;

@Component({
  selector: 'app-candidate-form',
  templateUrl: './candidate-form.component.html',
  styleUrls: ['./candidate-form.component.css']
})
export class CandidateFormComponent implements OnInit {
    loading = false;
     data;result;
     user;googleUser;email;linkedinUser;message;
    terms;
    code;ref_msg;


    credentials: any = {};
    countries = ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua & Deps', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Rep', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Congo {Democratic Rep}', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland {Republic}', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea North', 'Korea South', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar, {Burma}', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russian Federation', 'Rwanda', 'St Kitts & Nevis', 'St Lucia', 'Saint Vincent & the Grenadines', 'Samoa', 'San Marino', 'Sao Tome & Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad & Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'];

    constructor(
        private route: ActivatedRoute,
        private router: Router,private dataservice: DataService,
        private authenticationService: UserService,private authService: AuthService,private _linkedInService: LinkedInService,private titleService: Title,private newMeta: Meta
       ) {
		this.titleService.setTitle('Work on Blockchain | Signup developer or company');
		this.route.queryParams.subscribe(params => {
			this.code = params['code'];
		});

        if(this.code){
            this.authenticationService.getByRefrenceCode(this.code)
                .subscribe(
                    data => {

                        if(data) {
                          this.ref_msg = data + ' thinks you should join workonblockchain.com';
                        }
                        else{
                          this.ref_msg = 'Your refer code is invalid. Please contact our support';
                        }

                    },
                    error => {
                        ////console.log(error);
                        this.log = error;
                    }
                );
        }
	}
 ngOnDestroy() {
   ////console.log("ngOndesctroy");
    }

    ngOnInit()
    {
		$(function(){
			var hash = window.location.hash;
			hash && $('ul.nav a[href="' + hash + '"]').tab('show');
			$('.nav-tabs a').click(function (e) {
				$(this).tab('show');
				var scrollmem = $('body').scrollTop();
				window.location.hash = this.hash;
				$('html,body').scrollTop(scrollmem);
			});
		});

		this.newMeta.updateTag({ name: 'description', content: 'Signup for companies to apply to you! workonblockchain.com is a global blockchain agnostic hiring recruitment platform for blockchain developers, software developers, designers, product managers, CTOs and software engineer interns who are passionate about working on public and enterprise blockchain technology and cryptocurrencies.' });
	    this.newMeta.updateTag({ name: 'keywords', content: 'blockchain developer signup workonblockchain.com' });

        this.credentials.email='';

        this.credentials.country=-1;
        this.dataservice.currentMessage.subscribe(message => this.message = message);
         setInterval(() => {
                                this.message = "" ;
                                this.log='';
                        }, 13000);
    }
    log = '';
    email_log='';
    password_log='';
    pass_log='';

    signup_candidate(loginForm: NgForm)
    {

          this.credentials.type="candidate";
          this.credentials.social_type='';
        ////console.log(this.refer_by);
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

                    //////console.log(data);
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
            this.data = JSON.stringify(this.user);
            this.result = JSON.parse(this.data);
            localStorage.setItem('googleUser', JSON.stringify(this.result));
            if(this.result)
            {
                 ////console.log(this.result);
                 this.googleUser = JSON.parse(localStorage.getItem('googleUser'));
                 this.credentials.email= this.googleUser.email;
                 this.credentials.password= '';
                 this.credentials.type="candidate";
                 this.credentials.social_type=this.googleUser.provider;
                 this.authenticationService.create(this.credentials)
                .subscribe(
                    data => {
                    ////console.log(data);
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

        });

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
                        this.credentials.social_type='LINKEDIN';
                        if(this.linkedinUser.emailAddress)
                        {
                        this.authenticationService.create(this.credentials)
                        .subscribe(
                            data => {
                                ////console.log(data);
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
                    ////console.log(err);
                },
                complete: () => {
                    ////console.log('RAW API call completed');
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
            ////console.log("comapny signup form");
            this.credentials.type="company";
            this.credentials.social_type='';
            if(this.credentials.password != this.credentials.confirm_password )
            {
                this.credentials.password = '';
                this.credentials.confirm_password = '';
                this.password_log = "Password do not match";
            }
            else if( this.credentials.email && this.credentials.first_name && this.credentials.last_name && this.credentials.job_title && this.credentials.company_name
            && this.credentials.company_website && this.credentials.phone_number && this.credentials.country && this.credentials.postal_code &&
            this.credentials.city && this.credentials.password && this.credentials.password === this.credentials.confirm_password)
            {
				////console.log('else');
                this.authenticationService.create_employer(this.credentials)
                .subscribe(
                data =>
                {
                    ////console.log(data);
                    if(data.error)
                    {
                        this.dataservice.changeMessage(data.error);
                        this.log = data.error;
                    }

                    else
                    {
                        localStorage.setItem('currentUser', JSON.stringify(data));
                        //////console.log(localStorage.getItem('currentUser'));
                        //localStorage.removeItem('userInfo');
                        //this.router.navigate(['/company_wizard']);
                        window.location.href = '/company_wizard';
                    }
                },
                error =>
                {
                    //////console.log(error);
                    this.log = 'Something getting wrong';
                    this.loading = false;
                });
            }
            else
            {
                this.message = "Please fill all the fields";
            }
    }
}
