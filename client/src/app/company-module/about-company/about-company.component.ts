import { Component, OnInit,ElementRef, AfterViewInit } from '@angular/core';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { DataService } from "../../data.service";
import {NgForm} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {environment} from '../../../environments/environment';
import { DatePipe } from '@angular/common';
declare var $:any;
import { map } from 'rxjs/operators';

const URL = environment.backend_url;



@Component({
  selector: 'app-about-company',
  templateUrl: './about-company.component.html',
  styleUrls: ['./about-company.component.css']
})
export class AboutCompanyComponent implements OnInit,AfterViewInit {
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
  constructor(private route: ActivatedRoute,private datePipe: DatePipe,
              private router: Router,private http: HttpClient,
              private authenticationService: UserService,private dataservice: DataService,private el: ElementRef) {
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
      this.authenticationService.getCurrentCompany(this.currentUser._creator)
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
                this.img_data  =  data['company_logo'];

                let x = this.img_data.split("/");

                let last:any = x[x.length-1];

                this.img_src = last;

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
              // this.router.navigate(['/not_found']);
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
      this.authenticationService.about_company(this.currentUser._creator,companyForm.value)
        .subscribe(
          data => {
            if (data) {

              let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#profile');
              let fileCount: number = inputEl.files.length;
              let formData = new FormData();
              if (fileCount > 0) {

                if (inputEl && inputEl.files && inputEl.files.length > 0) {
                  let formData = new FormData();
                  if (inputEl.files.item(0).size < this.file_size) {


                    formData.append('photo', inputEl.files.item(0));


                    this.authenticationService.company_image(formData)
                      .subscribe(
                        imageRes => {
                          this.router.navigate(['/preferences']);
                        });
                  }
                  else {
                    this.image_log = "Image size should be less than 1MB";
                  }

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
              this.log = "Something getting wrong";
            }
          });
    }

    else {
      this.error_msg = "One or more fields need to be completed. Please scroll up to see which ones.";
    }
  }
}
