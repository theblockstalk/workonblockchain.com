import { Component, OnInit,ElementRef, AfterViewInit, Input, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { DataService } from "../../data.service";
import {NgForm} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {environment} from '../../../environments/environment';
import { DatePipe,isPlatformBrowser } from '@angular/common';
import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';
declare var $:any;
const URL = environment.backend_url;

@Component({
  selector: 'app-about-company',
  templateUrl: './about-company.component.html',
  styleUrls: ['./about-company.component.css']
})
export class AboutCompanyComponent implements OnInit,AfterViewInit {
  @Input() name: string;
  cropperSettings: CropperSettings;
  imageCropData:any;
  @ViewChild('cropper', undefined)
  cropper:ImageCropperComponent;
  info : any;
  currentUser: User;log;
  founded_log;employee_log;funded_log;des_log;image_src;
  company_founded;no_of_employees;company_funded;company_description;terms_active_class;about_active_class;image;
  img_data;
  img_src;
  text;
  companyMsgTitle;
  companyMsgBody;
  error_msg;
  preference;
  pref_active_class;
  pref_disable;
  imagePreviewLink;
  prefil_image;
  constructor(private route: ActivatedRoute,private datePipe: DatePipe,
              private router: Router,private http: HttpClient,
              private authenticationService: UserService,private dataservice: DataService,private el: ElementRef,@Inject(PLATFORM_ID) private platformId: Object) {
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
    this.cropperSettings.cropperDrawSettings.strokeWidth = 2;
    this.cropperSettings.cropperDrawSettings.strokeColor = 'black';
    this.cropperSettings.rounded = true;
    this.imageCropData = {};
  }

  ngAfterViewInit(): void
  {
    window.scrollTo(0, 0);
  }

  ngOnInit() {

    this.pref_disable='disabled';
    this.currentyear = this.datePipe.transform(Date.now(), 'yyyy');

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if(!this.currentUser)
    {
      this.router.navigate(['/login']);
    }
    else if(this.currentUser && this.currentUser.type=='company')
    {
      this.authenticationService.getCurrentCompany(this.currentUser._id)
        .subscribe(
          data =>
          {
            if(data['company_founded'] || data['no_of_employees'] || data['company_funded'] || data['company_description'] ||data['company_logo'])
            {
              this.company_founded=data['company_founded'];
              this.no_of_employees=data['no_of_employees'];
              this.company_funded=data['company_funded'];
              this.company_description =data['company_description'];
              if(data['company_logo'] != null){
                this.imagePreviewLink = data['company_logo'];
              }
              this.preference  = '/preferences';
            }
            if(data['saved_searches'] && data['saved_searches'].length > 0) {

              this.pref_active_class = 'fa fa-check-circle text-success';
            }
            if(data['terms_id'])
            {
              this.terms_active_class = 'fa fa-check-circle text-success';
              //this.router.navigate(['/login']);
            }
            if(data['company_founded'] && data['no_of_employees'] && data['company_funded'] && data['company_description'])
            {
              this.pref_disable = '';
              this.about_active_class = 'fa fa-check-circle text-success';
            }

          },
          error =>
          {
            if(error['message'] === 500 || error['message'] === 401)
            {
              localStorage.setItem('jwt_not_found', 'Jwt token not found');
              localStorage.removeItem('currentUser');
              localStorage.removeItem('googleUser');
              localStorage.removeItem('close_notify');
              localStorage.removeItem('linkedinUser');
              localStorage.removeItem('admin_log');
              window.location.href = '/login';
            }

            if(error['message'] === 403)
            {
               this.router.navigate(['/not_found']);
            }
          });

    }
    else
    {

      this.router.navigate(['/not_found']);

    }
  }

  image_log;file_size=1048576;
  currentyear;
  yearValidation;
  yearVerification;

  about_company(companyForm: NgForm)
  {
    this.error_msg="";
    if(this.company_founded){
      this.company_founded = parseInt(this.company_founded);
    }

    if(!this.company_founded)
    {
      this.founded_log = 'Please fill when was the company founded';
    }

    if(!this.no_of_employees)
    {
      this.employee_log = 'Please fill no. of employees';

    }


    if(!this.company_funded)
    {
      this.funded_log = 'Please fill how is the company funded';

    }

    if(this.company_founded >  this.currentyear ) {
      this.yearValidation = "Date must be in the past"
    }

    if(this.company_founded < 1800) {
      this.yearValidation = "Please enter value greater than 1800";
    }


    if(!this.company_description)
    {
      this.des_log = 'Please fill company description';
    }
    if(this.company_founded && this.company_founded > 1800 && this.no_of_employees && this.company_funded && this.company_description && this.company_founded <=  this.currentyear )
    {
      companyForm.value.company_founded = parseInt(companyForm.value.company_founded);
      this.authenticationService.edit_company_profile(this.currentUser._id, companyForm.value, false)
        .subscribe(
          data => {
            if (data) {
              if(this.imageCropData.image) {
                const file = this.dataURLtoFile(this.imageCropData.image, this.imageName);
                const formData = new FormData();
                formData.append('company_logo', file);
                this.authenticationService.edit_company_profile(this.currentUser._id ,formData , false)
                  .subscribe(
                    data => {
                      if (data) {
                        this.router.navigate(['/preferences']);
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
                this.router.navigate(['/preferences']);
                //this.router.navigate(['/company_profile']);
              }

            }
            else {
              this.router.navigate(['/preferences']);
              //this.router.navigate(['/company_profile']);
            }
          },
          error =>
          {
            if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              this.log = error['error']['message'];
              this.router.navigate(['/not_found']);
            }
            else if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              this.log = error['error']['message'];
              this.router.navigate(['/not_found']);
            }
            else {
              this.log = "Something went wrong";
            }
          });
    }

    else {
      this.error_msg = "One or more fields need to be completed. Please scroll up to see which ones.";
    }
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
