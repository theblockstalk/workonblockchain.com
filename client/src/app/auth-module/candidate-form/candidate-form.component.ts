import {AfterViewInit, Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import {NgForm} from '@angular/forms';
import { DataService } from '../../data.service';
import { Title, Meta } from '@angular/platform-browser';
declare var $: any;
import {environment} from '../../../environments/environment';
import {constants} from '../../../constants/constants';

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
  ref_discount_msg;
  public isUserAuthenticatedEmittedValue = false;
  public isUserAuthenticated;
  first_name_log;
  last_name_log;
  google_id;
  google_url;
  linkedin_url;
  linkedin_id;
  country_code_log;

  credentials: any = {};
  countries = constants.countries;
  country_codes = constants.country_codes;

  constructor(
    private route: ActivatedRoute,
    private router: Router,private dataservice: DataService,
    private authenticationService: UserService,private titleService: Title,private newMeta: Meta
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
                }
                else {
                  this.ref_msg = 'You have been referred to workonblockchain.com';
                }

                if(data['discount']){
                  this.ref_discount_msg = '. Congratulations, you will receive a '+data['discount']+'% discount off our fee when you make a hire!';
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
              this.log = "Something went wrong";
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
    this.google_id = environment.google_client_id;
    this.linkedin_id = environment.linkedin_id;
    let linkedin_redirect_url = environment.linkedin_redirect_url;
    let google_redirect_url = environment.google_redirect_url;

    this.google_url='https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&prompt=consent&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fplus.profile.emails.read%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fplus.login&response_type=code&client_id='+this.google_id+'&redirect_uri='+google_redirect_url;
    this.linkedin_url = 'https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id='+this.linkedin_id+'&state=4Wx72xl6lDlS34Cs&redirect_uri='+linkedin_redirect_url+'&scope=r_liteprofile%20r_emailaddress';
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



  signup_candidate(loginForm: NgForm)
  {
    this.button_status="submit";
    this.credentials.type="candidate";

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
      let queryBody :any = {};
      queryBody.email = this.credentials.email;
      queryBody.first_name = this.credentials.first_name;
      queryBody.last_name = this.credentials.last_name;
      queryBody.password = this.credentials.password;
      if(this.credentials.referred_email) queryBody.referred_email  = this.credentials.referred_email;
      this.authenticationService.createCandidate(queryBody)
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
              this.log = 'Something went wrong';
            }
          });


    }

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
  contact_number_log;

  company_signup(signupForm: NgForm)
  {
    this.company_log = '';
    this.companySignup = "submit";
    this.credentials.type="company";
    this.password_log = '';
    this.contact_number_log = '';
    let errorCount = 0;

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
    if(!this.credentials.company_phone)
    {
      this.companyPhoneLog = 'Please enter phone number';
    }
    if (this.credentials.company_phone) {
      if((this.credentials.company_phone.length < 4 || this.credentials.company_phone.length > 15)){
        this.contact_number_log = "Please enter minimum 4 and maximum 15 digits";
        errorCount = 1;
      }
      if(!this.checkNumber(this.credentials.company_phone)) {
        errorCount = 1;
      }
    }

    if(!this.credentials.country_code)
    {
      this.country_code_log = 'Please select country code';
    }
    if(!this.credentials.company_country)
    {
      this.companyCountryLog = 'Please select country name';
    }
    if(!this.credentials.company_postcode)
    {
      this.companyPostalCodeLog = 'Please enter postal code';
    }
    if(!this.credentials.company_city)
    {
      this.companyCityLog = 'Please enter city name';
    }
    if(!this.credentials.password)
    {
      this.companyPasswordLog = 'Please enter password'
    }
    if(errorCount === 0 && signupForm.valid === true && this.credentials.email && this.credentials.first_name && this.credentials.last_name && this.credentials.job_title && this.credentials.company_name
      && this.credentials.company_website && this.credentials.company_phone && this.credentials.country_code && this.credentials.company_country && this.credentials.company_postcode &&
      this.credentials.company_city && this.credentials.password && this.credentials.password === this.credentials.confirm_password)
    {
      console.log(this.credentials.country_code);
      this.credentials.company_phone = this.credentials.country_code +' '+this.credentials.company_phone;
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
              this.log = 'Something went wrong';
            }
          });
    }

  }

  checkNumber(salary) {
    return /^[0-9]*$/.test(salary);
  }
}
