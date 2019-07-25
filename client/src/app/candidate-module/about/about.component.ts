import { Component, OnInit,ElementRef, Input,AfterViewInit, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
declare var synapseThrow: any;
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
import {constants} from '../../../constants/constants';
import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';
import {NgForm} from '@angular/forms';
import {isPlatformBrowser} from "@angular/common";
declare var $:any;

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit,AfterViewInit
{
  @Input() name: string;
  cropperSettings: CropperSettings;
  imageCropData:any;
  @ViewChild('cropper', undefined)
  cropper:ImageCropperComponent;
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
  contact_number_log;
  imagePreviewLink;
  prefil_image;

  constructor(private http: HttpClient,private route: ActivatedRoute,private router: Router,private authenticationService: UserService, private el: ElementRef,@Inject(PLATFORM_ID) private platformId: Object)
  {
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.noFileInput = true;
    this.cropperSettings.width = 200;
    this.cropperSettings.height = 200;
    this.cropperSettings.minWidth = 180;
    this.cropperSettings.minHeight = 180;
    this.cropperSettings.croppedWidth = 200;
    this.cropperSettings.croppedHeight = 200;
    this.cropperSettings.canvasWidth = 300;
    this.cropperSettings.canvasHeight = 300;
    this.cropperSettings.rounded = true;
    this.cropperSettings.cropperDrawSettings.strokeWidth = 2;
    this.cropperSettings.cropperDrawSettings.strokeColor = 'black';
    this.imageCropData = {};
  }

  ngAfterViewInit(): void
  {
    window.scrollTo(0, 0);
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        $('.selectpicker').selectpicker();
      }, 300);

      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh');
      }, 900);
    }
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

      this.authenticationService.getCandidateProfileById(this.currentUser._id , false)
        .subscribe(
          data =>
          {
            if(data['first_name']) this.info.first_name = data['first_name'];
            if(data['last_name']) this.info.last_name = data['last_name'];
            if(data['refered_id'])
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
              this.info.contact_number = '';
              if(data['contact_number']) {
                let contact_number = data['contact_number'];
                contact_number = contact_number.replace(/^00/, '+');
                contact_number = contact_number.split(" ");
                if(contact_number.length>1) {
                  for (let i = 0; i < contact_number.length; i++) {
                    if (i === 0) this.info.country_code = contact_number[i];
                    else this.info.contact_number = this.info.contact_number+''+contact_number[i];
                  }
                }
                else this.info.contact_number = contact_number[0];
              }

              /*if(data['candidate'].github_account) this.info.github_account = data['candidate'].github_account;
              if(data['candidate'].stackexchange_account) this.info.exchange_account = data['candidate'].stackexchange_account;
              if(data['candidate'].linkedin_account) this.info.linkedin_account = data['candidate'].linkedin_account;
              if(data['candidate'].medium_account) this.info.medium_account = data['candidate'].medium_account;
              if(data['candidate'].stackoverflow_url) this.info.stackoverflow_url = data['candidate'].stackoverflow_url;
              if(data['candidate'].personal_website_url) this.info.personal_website_url = data['candidate'].personal_website_url;
              */
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
              if(data['image'] != null ) {
                this.imagePreviewLink = data['image'];
              }
              setTimeout(() => {
                $('.selectpicker').selectpicker('refresh');
              }, 300);
            }

            if(data['contact_number']  && data['nationality'] && data['first_name'] && data['last_name'])
            {
              this.active_class='fa fa-check-circle text-success';
              this.job_disable = '';
              this.link= "/work";
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

  about(aboutForm: NgForm) {
    this.error_msg = "";
    let errorCount = 0;
    this.contact_number_log = '';

    if (this.referred_id) {
      this.info.referred_id = this.referred_id;
    }

    if(!this.info.first_name) {
      this.first_name_log = 'Please enter first name';
      errorCount++;
    }
    if(!this.info.last_name) {
      this.last_name_log = 'Please enter last name';
      errorCount++;
    }

    if (!this.info.contact_number) {
      this.contact_name_log = "Please enter phone number";
      errorCount++;
    }
    if (this.info.contact_number) {
      if((this.info.contact_number.length < 4 || this.info.contact_number.length > 15)){
        this.contact_number_log = "Please enter minimum 4 and maximum 15 digits";
        errorCount++;
      }
      if(!this.checkNumber(this.info.contact_number)) {
        errorCount++;
      }
    }

    if (!this.info.country_code) {
      this.country_code_log = "Please select country code";
      errorCount++;
    }

    if(!this.info.nationality || (this.info.nationality && this.info.nationality.length === 0) ) {
      this.nationality_log = "Please choose nationality";
      errorCount++;
    }
    if(this.info.nationality && this.info.nationality.length > 4) {
      this.nationality_log = "Please select maximum 4 nationalities";
      errorCount++;
    }
    if (!this.info.country) {
      this.country_log = "Please choose base country";
      errorCount++;
    }
    if (!this.info.city) {
      this.city_log = "Please enter base city";
      errorCount++;
    }
    if(errorCount === 0 && this.imageCropData.image) {
      const file = this.dataURLtoFile(this.imageCropData.image, this.imageName);
      const formData = new FormData();
      formData.append('image', file);
      this.authenticationService.edit_candidate_profile(this.currentUser._id ,formData , false)
        .subscribe(
          data => {
            if (data) {

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
    if (errorCount === 0 && aboutForm.valid === true) {
      let inputQuery:any ={};
      let candidateQuery:any ={};

      if(this.info.first_name) inputQuery.first_name = this.info.first_name;
      if(this.info.last_name) inputQuery.last_name = this.info.last_name;
      if(this.info.contact_number && this.info.country_code) inputQuery.contact_number = this.info.country_code +' '+ this.info.contact_number;

      /*if(this.info.github_account) candidateQuery.github_account = this.info.github_account;
      else inputQuery.unset_github_account = true;

      if(this.info.exchange_account) candidateQuery.stackexchange_account = this.info.exchange_account;
      else inputQuery.unset_exchange_account = true;

      if(this.info.linkedin_account) candidateQuery.linkedin_account = this.info.linkedin_account;
      else inputQuery.unset_linkedin_account = true;

      if(this.info.medium_account) candidateQuery.medium_account = this.info.medium_account;
      else inputQuery.unset_medium_account = true;

      if(this.info.stackoverflow_url) candidateQuery.stackoverflow_url = this.info.stackoverflow_url;
      else inputQuery.unset_stackoverflow_url= true;

      if(this.info.personal_website_url) candidateQuery.personal_website_url = this.info.personal_website_url;
      else inputQuery.unset_personal_website_url = true;
      */

      if(this.info.nationality) inputQuery.nationality = this.info.nationality;
      if(this.info.country) candidateQuery.base_country = this.info.country;
      if(this.info.city) candidateQuery.base_city = this.info.city;
      inputQuery.candidate = candidateQuery;
      inputQuery.wizardNum = 2;
      this.authenticationService.edit_candidate_profile(this.currentUser._id, inputQuery, false)
        .subscribe(
          data => {
            if(data)
            {
              this.router.navigate(['/work']);
            }

          },
          error => {
            if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              this.router.navigate(['/not_found']);
            }

          });
    }
    else {
      this.error_msg = "One or more fields need to be completed. Please scroll up to see which ones.";
    }
  }

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

  checkNumber(salary) {
    return /^[0-9]*$/.test(salary);
  }

  imageName;
  fileChangeListener($event) {
    var image:any = new Image();
    var file:File = $event.target.files[0];
    var myReader:FileReader = new FileReader();
    var that = this;
    myReader.onloadend = function (loadEvent:any) {
      image.src = loadEvent.target.result;
      that.cropper.setImage(image);
    };
    this.imageName = file.name;
    myReader.readAsDataURL(file);
  }


  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, {type:mime});
  }

  imageCropped(key) {
    if(key === 'cancel') {
      this.imageCropData = {};
    }
    if (isPlatformBrowser(this.platformId)) $('#imageModal').modal('hide');
  }


}

