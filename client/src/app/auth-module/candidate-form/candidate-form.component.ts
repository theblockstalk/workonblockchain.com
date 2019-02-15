import {AfterViewInit, Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import { AuthService } from 'angular4-social-login';
import { GoogleLoginProvider } from 'angular4-social-login';
import {NgForm} from '@angular/forms';
import { DataService } from '../../data.service';
import { Title, Meta } from '@angular/platform-browser';
declare var $: any;
import { LinkedInService } from '../../linkedin-api';

@Component({
  selector: 'app-candidate-form',
  templateUrl: './candidate-form.component.html',
  styleUrls: ['./candidate-form.component.css']
})
export class CandidateFormComponent implements OnInit, AfterViewInit {
  loading = false;
  data;result;
  user;googleUser;email;linkedinUser;message;
  terms;
  code;ref_msg;
  public isUserAuthenticatedEmittedValue = false;
  public isUserAuthenticated;
  first_name_log;
  last_name_log;

  private basicProfileFields = ['id' , 'first-name', 'last-name', 'maiden-name', 'email-address', 'formatted-name', 'phonetic-first-name', 'phonetic-last-name', 'formatted-phonetic-name', 'headline', 'location', 'industry', 'picture-url', 'positions'];

  credentials: any = {};
  countries = ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua & Deps', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Rep', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Congo {Democratic Rep}', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland {Republic}', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea North', 'Korea South', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar, {Burma}', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russian Federation', 'Rwanda', 'St Kitts & Nevis', 'St Lucia', 'Saint Vincent & the Grenadines', 'Samoa', 'San Marino', 'Sao Tome & Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad & Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,private dataservice: DataService,
    private authenticationService: UserService,private authService: AuthService,private _linkedInService: LinkedInService,private titleService: Title,private newMeta: Meta
  ) {
    this.titleService.setTitle('Work on Blockchain | Signup developer or company');
    this.code = localStorage.getItem('ref_code');

    if (this.code) {
      this.authenticationService.getByRefrenceCode(this.code)
        .subscribe(
          data => {
            if (data) {
              if (data ) {
                if(data['name']) {
                  this.ref_msg = data['name'] + ' thinks you should join workonblockchain.com';
                  if(data['discount']){
                    this.ref_msg = this.ref_msg +'. Congratulations, you will receive a '+data['discount']+'% discount off our fee when you make a hire!';
                  }
                }
                else {
                  this.ref_msg = 'You have been referred to workonblockchain.com';
                }
              }
              this.credentials.referred_email = data['email'];
            }
            else {
              this.ref_msg = 'Your refer code is invalid. Please contact our support';
            }
          },
          error => {
            if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false)
            {
              this.log = error['error']['message'];
            }
            else if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false)
            {
              this.log = error['error']['message'];
            }
            else {
              this.log = "Something getting wrong";
            }
          }
        );
    }
  }

  ngAfterViewInit(): void
  {
    window.scrollTo(0, 0);
    setTimeout(() => {
      $('.selectpicker').selectpicker();
    }, 300);

    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh');
    }, 900);
  }


  ngOnInit()
  {
    $(function(){
      var hash = window.location.hash;
      hash && $('div.nav a[href="' + hash + '"]').tab('show');
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

    this.dataservice.currentMessage.subscribe(message => this.message = message);
    setInterval(() => {
      this.message = "" ;
    }, 13000);
  }
  log = '';
  email_log='';
  password_log='';
  pass_log='';
  button_status;
  emailname;

  public rawApiCall() {
    let url =`/people/~:(${this.basicProfileFields.join(',')})?format=json'`;
    this._linkedInService.raw(url)
      .asObservable()
      .subscribe({
        next: (data) => {
          localStorage.setItem('linkedinUser', JSON.stringify(data));
          if(data)
          {
            this.linkedinUser = JSON.parse(localStorage.getItem('linkedinUser'));
            this.credentials.email= this.linkedinUser.emailAddress;
            this.credentials.password= '';
            this.credentials.type="candidate";
            this.credentials.social_type='LINKEDIN';
            this.credentials.linkedin_id = this.linkedinUser.id;
            this.credentials.first_name = this.linkedinUser.firstName;
            this.credentials.last_name = this.linkedinUser.lastName;
            if(this.linkedinUser.emailAddress)
            {
              this.authenticationService.create(this.credentials)
                .subscribe(
                  data => {
                    this.credentials.email = '';

                    localStorage.setItem('currentUser', JSON.stringify(data));
                    localStorage.removeItem('ref_code');
                    window.location.href = '/terms-and-condition';

                  },
                  error => {
                    this.loading = false;
                    if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
                      this.log = error['error']['message'];
                    }
                    else if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
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
        },
        error: (err) => {
          //console.log(err);
        },
        complete: () => {
          //console.log('RAW API call completed');
        }
      });
  }

  signup_candidate(loginForm: NgForm)
  {
    this.button_status="submit";
    this.credentials.type="candidate";
    this.credentials.social_type='';

    if(!this.credentials.email)
    {
      this.email_log="Please enter email address";
    }
    if(!this.credentials.first_name)
    {
      this.first_name_log="Please enter first name";
    }
    if(!this.credentials.last_name)
    {
      this.last_name_log="Please enter last name";
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
      this.pass_log="Please enter password";
    }
    else
    {
      this.pass_log="";
    }
    if(loginForm.valid === true && this.credentials.first_name && this.credentials.last_name && this.credentials.email && this.credentials.password && this.credentials.confirm_password && this.credentials.password == this.credentials.confirm_password)
    {

      this.authenticationService.create(this.credentials)
        .subscribe(
          data =>
          {
            localStorage.setItem('currentUser', JSON.stringify(data));
            localStorage.removeItem('ref_code');
            window.location.href = '/candidate-verify-email';

          },
          error =>
          {
            this.loading = false;

            if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              this.log = error['error']['message'];
            }
            else if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              this.log = error['error']['message'];
            }
            else {
              this.log = 'Something getting wrong';
            }
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
        this.googleUser = JSON.parse(localStorage.getItem('googleUser'));
        this.credentials.email= this.googleUser.email;
        this.credentials.password= '';
        this.credentials.type="candidate";
        this.credentials.social_type=this.googleUser.provider;
        this.credentials.first_name = this.googleUser.firstName;
        this.credentials.last_name = this.googleUser.lastName;
        this.authenticationService.create(this.credentials)
          .subscribe(
            data => {
              this.credentials.email= '';
              localStorage.setItem('currentUser', JSON.stringify(data));
              localStorage.removeItem('ref_code');
              window.location.href = '/terms-and-condition';

            },
            error => {
              this.loading = false;
              if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
                this.log = error['error']['message'];
              }
              else if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
                this.log = error['error']['message'];
              }
              else {
                this.log = 'Something getting wrong';
              }
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
        //console.log("state");
      },
      complete: () => {
        // Completed
        //console.log("complete");
      }
    });

    this.isUserAuthenticated = this._linkedInService.isUserAuthenticated$;
    let count = 0;
    this._linkedInService.isUserAuthenticated$.subscribe({
      next: (state) => {
        if(state === true && count===0) {
          this.rawApiCall();
          count++;

        }
        this.isUserAuthenticatedEmittedValue = true;
      }
    });
  }

  company_log;
  companySignup;
  companyEmailLog;
  companyFirstNameLog;
  companyLastNameLog;
  companyJobTitleLog;
  companyNameLog;
  companyWebsiteLog;
  companyPhoneLog;
  companyCountryLog;
  companyPostalCodeLog;
  companyCityLog;
  companyPasswordLog;

  company_signup(signupForm: NgForm)
  {
    this.company_log = '';
    this.companySignup = "submit";
    this.credentials.type="company";
    this.credentials.social_type='';
    this.password_log = '';
    if(this.credentials.password != this.credentials.confirm_password )
    {
      this.credentials.confirm_password = '';
      this.password_log = "Password do not match";
    }

    if(!this.credentials.email)
    {
      this.companyEmailLog = 'Please enter email address';
    }
    if(!this.credentials.first_name)
    {
      this.companyFirstNameLog = 'Please enter first name';
    }
    if(!this.credentials.last_name)
    {
      this.companyLastNameLog = 'Please enter last name';
    }
    if(!this.credentials.job_title)
    {
      this.companyJobTitleLog = 'Please enter job title';
    }
    if(!this.credentials.company_name)
    {
      this.companyNameLog = 'Please enter company name';
    }
    if(!this.credentials.company_website)
    {
      this.companyWebsiteLog = 'Please enter company website url';
    }
    if(!this.credentials.phone_number)
    {
      this.companyPhoneLog = 'Please enter phone number';
    }
    if(!this.credentials.country)
    {
      this.companyCountryLog = 'Please select country name';
    }
    if(!this.credentials.postal_code)
    {
      this.companyPostalCodeLog = 'Please enter postal code';
    }
    if(!this.credentials.city)
    {
      this.companyCityLog = 'Please enter city name';
    }
    if(!this.credentials.password)
    {
      this.companyPasswordLog = 'Please enter password'
    }
    if(signupForm.valid === true && this.credentials.email && this.credentials.first_name && this.credentials.last_name && this.credentials.job_title && this.credentials.company_name
      && this.credentials.company_website && this.credentials.phone_number && this.credentials.country && this.credentials.postal_code &&
      this.credentials.city && this.credentials.password && this.credentials.password === this.credentials.confirm_password)
    {
      this.authenticationService.create_employer(this.credentials)
        .subscribe(
          data =>
          {
            localStorage.setItem('currentUser', JSON.stringify(data));
            localStorage.removeItem('ref_code');
            window.location.href = '/company-verify-email';
          },
          error =>
          {
            this.loading = false;

            if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              this.company_log = error['error']['message'];
            }
            else if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              this.company_log = error['error']['message'];
            }
            else {
              this.log = 'Something getting wrong';
            }
          });
    }

  }
}
