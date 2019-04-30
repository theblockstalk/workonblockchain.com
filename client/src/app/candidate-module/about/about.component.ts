import { Component, OnInit,ElementRef, Input,AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
declare var synapseThrow: any;
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
declare var $:any;
import {constants} from '../../../constants/constants';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit,AfterViewInit
{
  currentUser: User;
  log='';
  info: any = {};
  email_data : any ={};
  link='';
  class='';
  resume_class;
  exp_class;
  googleUser;
  linkedinUser;
  active_class;
  job_active_class;
  exp_active_class;
  resume_active_class;
  image_log;
  file_size=1048576;
  error_msg;
  gender =
    [
      "Male",
      "Female"
    ]

  nationality = constants.nationalities;
  term_active_class;
  term_link;
  img_src;
  referred_id;
  job_disable;
  resume_disable;
  exp_disable;
  first_name_log;
  last_name_log;
  contact_name_log;
  nationality_log;
  country_log;
  city_log;
  countries = constants.countries;
  country_codes = constants.country_codes;
  country_code_log;

  constructor(private http: HttpClient,private route: ActivatedRoute,private router: Router,private authenticationService: UserService, private el: ElementRef)
  {
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
    this.job_disable = "disabled";
    this.resume_disable = "disabled";
    this.exp_disable = "disabled";
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.googleUser = JSON.parse(localStorage.getItem('googleUser'));

    this.linkedinUser = JSON.parse(localStorage.getItem('linkedinUser'));

    if(this.googleUser)
    {
      this.info.image_src = this.googleUser.photoUrl;
      if( this.info.image_src)
      {
        let x = this.info.image_src.split("/");

        let last:any = x[x.length-1];

        this.img_src = last;
      }

    }

    if(!this.currentUser)
    {
      this.router.navigate(['/signup']);
    }

    if(this.currentUser && this.currentUser.type=='candidate')
    {

      this.authenticationService.getById(this.currentUser._id)
        .subscribe(
          data =>
          {
            if(data['first_name']) this.info.first_name = data['first_name'];
            if(data['last_name']) this.info.last_name = data['last_name'];
            if(data['refered_id']) //&& !data.first_name && !data.last_name)
            {
              this.referred_id = data['refered_id'];

            }
            if(data['candidate'].terms_id)
            {
              this.term_active_class='fa fa-check-circle text-success';
              this.term_link = '/terms-and-condition';
            }

            if(data['contact_number']  || data['nationality'] || data['first_name'] || data['last_name'] || data['candidate'])
            {
              let contact_number = data['contact_number'];
              contact_number = contact_number.split(" ");
              console.log(contact_number.length);
              if(contact_number.length>1){
                this.info.country_code = contact_number[0];
                this.info.contact_number = contact_number[1];
              }
              else this.info.contact_number = contact_number[0];
              console.log(this.info.contact_number);

              if(data['candidate'].github_account) this.info.github_account = data['candidate'].github_account;
              if(data['candidate'].stackexchange_account) this.info.exchange_account = data['candidate'].stackexchange_account;
              if(data['candidate'].linkedin_account) this.info.linkedin_account = data['candidate'].linkedin_account;
              if(data['candidate'].medium_account) this.info.medium_account = data['candidate'].medium_account;

              if(data['nationality'])
              {
                this.info.nationality = data['nationality'];
              }
              if(data['candidate'] && data['candidate'].base_country)
              {
                this.info.country = data['candidate'].base_country;
              }
              if(data['candidate'] && data['candidate'].base_city){
                this.info.city = data['candidate'].base_city;
              }

              if(data['image'] != null )
              {
                this.info.image_src = data['image'] ;


                let x = this.info.image_src.split("/");

                let last:any = x[x.length-1];

                this.img_src = last;

              }

            }

            if(data['contact_number']  && data['nationality'] && data['first_name'] && data['last_name'])
            {
              this.active_class='fa fa-check-circle text-success';
              this.job_disable = '';
              this.link= "/job";
            }

            if(data['candidate'].employee || data['candidate'].contractor || data['candidate'].volunteer)
            {
              this.resume_disable = '';
              this.job_active_class = 'fa fa-check-circle text-success';
              this.resume_class="/resume";
            }

            if(data['candidate'].why_work && data['candidate'].interest_areas )
            {
              this.exp_disable = '';
              this.resume_class="/resume";
              this.exp_class = "/experience";
              this.resume_active_class='fa fa-check-circle text-success';
            }

            if( data['candidate'].description)
            {
              this.exp_class = "/experience";
              this.exp_active_class = 'fa fa-check-circle text-success';
            }



          },
          error =>
          {
            if(error.message === 500 || error.message === 401)
            {
              localStorage.setItem('jwt_not_found', 'Jwt token not found');
              localStorage.removeItem('currentUser');
              localStorage.removeItem('googleUser');
              localStorage.removeItem('close_notify');
              localStorage.removeItem('linkedinUser');
              localStorage.removeItem('admin_log');
              window.location.href = '/login';
            }

            if(error.message === 403)
            {
              // this.router.navigate(['/not_found']);
            }
          });
      this.router.navigate(['/about']);
    }
    else
    {
      this.router.navigate(['/not_found']);
    }

  }

  about() {
    this.error_msg = "";
    if (this.referred_id) {
      this.info.referred_id = this.referred_id;
    }

    if(!this.info.first_name) this.first_name_log = 'Please enter first name';
    if(!this.info.last_name) this.last_name_log = 'Please enter last name';

    if (!this.info.contact_number) {
      this.contact_name_log = "Please enter contact number";
    }

    if (!this.info.country_code) {
      this.country_code_log = "Please select country code";
    }

    if (!this.info.nationality) {
      this.nationality_log = "Please choose nationality";
    }
    if (!this.info.country) {
      this.country_log = "Please choose base country";
    }
    if (!this.info.city) {
      this.city_log = "Please enter base city";
    }
    if (this.info.country_code && this.info.contact_number && this.info.nationality && this.info.city && this.info.country && this.info.first_name && this.info.last_name) {
      this.info.contact_number = this.info.country_code +' '+this.info.contact_number;
      console.log(this.info.contact_number);
      this.authenticationService.about(this.currentUser._id, this.info)
        .subscribe(
          data => {
            if (data['success']) {

              if (this.info.image) {

                let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#aa');
                let fileCount: number = inputEl.files.length;
                let formData = new FormData();
                if (fileCount > 0) {
                  if (inputEl.files.item(0).size < this.file_size) {
                    formData.append('photo', inputEl.files.item(0));
                    this.authenticationService.uploadCandImage(formData)
                    .subscribe(
                      data => {
                        if (data['success']) {
                          this.router.navigate(['/job']);
                        }
                      },
                      error => {
                        if (error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false) {
                          localStorage.setItem('jwt_not_found', 'Jwt token not found');
                          localStorage.removeItem('currentUser');
                          localStorage.removeItem('googleUser');
                          localStorage.removeItem('close_notify');
                          localStorage.removeItem('linkedinUser');
                          localStorage.removeItem('admin_log');
                          window.location.href = '/login';
                        }
                      }
                    );
                  }
                  else {
                    this.image_log = "Image size should be less than 1MB";
                  }
                }
                else {
                  this.router.navigate(['/job']);
                }
              }
              else {
                this.router.navigate(['/job']);
              }
            }
          },
          error => {
            if (error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              window.location.href = '/not_found';
            }
          });
    }
    else {
      this.error_msg = "One or more fields need to be completed. Please scroll up to see which ones.";
    }
  }

  /*referred_email()
  {
    if(this.referred_id)
    {
      this.email_data.referred_id = this.referred_id;
      this.email_data.referred_fname = this.info.first_name;
      this.email_data.referred_lname = this.info.last_name;

      this.authenticationService.email_referred_user(this.email_data).subscribe(
        data =>
        {
          if(data.success === true)
          {

          }
          else
          {

          }

        });

    }
    else {

    }
<<<<<<< HEAD
  }*/
  verify_email()
  {

    if(this.currentUser.email)
    {

      this.authenticationService.verify_client(this.currentUser.email)
        .subscribe(
          data => {
          },
          error => {

          });

    }

  }


}

