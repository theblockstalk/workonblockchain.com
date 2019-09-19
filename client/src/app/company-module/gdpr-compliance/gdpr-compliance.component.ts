import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import {UserService} from '../../user.service';

@Component({
  selector: 'app-gdpr-compliance',
  templateUrl: './gdpr-compliance.component.html',
  styleUrls: ['./gdpr-compliance.component.css']
})
export class GDPRComplianceComponent implements OnInit {

  currentUser;about_active_class;wizardLinks = [];us_privacy_shield;
  commercial_canada;companyDoc;dta_contract;file_name;gdprCompliance_log;
  commercial_canada_error;us_privacy_shield_error;
  radio_options: [
    {name: 'Yes', value: 'yes', checked: false},
    {name: 'No', value: 'no', checked: false}
  ];

  constructor(private router: Router, private authenticationService: UserService, private el: ElementRef) { }

  ngOnInit() {
    console.log('in GDPRComplianceComponent');
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if(!this.currentUser) this.router.navigate(['/login']);
    else if(this.currentUser && this.currentUser.type=='company') {
      this.authenticationService.getCurrentCompany(this.currentUser._id, false)
        .subscribe(
          data =>
          {
            this.companyDoc = data;
            console.log(this.companyDoc);
            if(data['terms_id']) {
              let termsLink = {
                'activeClass': true,
                'routeLink' : '/company_wizard',
                'linkText' : 'Summary of T&Cs'
              };
              this.wizardLinks.push(termsLink);
            }
            if(data['company_founded'] && data['no_of_employees'] && data['company_funded'] && data['company_description']) {
              let aboutCompLink = {
                'activeClass': true,
                'routeLink' : '/about_comp',
                'linkText' : 'About the company'
              };
              this.wizardLinks.push(aboutCompLink);
            }
            if (data['saved_searches'] && data['saved_searches'].length > 0) {
              let preferencesLink = {
                'activeClass': true,
                'routeLink' : '/preferences',
                'linkText' : 'Talent requirements'
              };
              this.wizardLinks.push(preferencesLink);
            }
            if (data['pricing_plan']) {
              let pricingLink = {
                'activeClass': true,
                'routeLink' : '/users/company/wizard/pricing',
                'linkText' : 'Price plan'
              };
              this.wizardLinks.push(pricingLink);
            }
            let gdprLink = {
              'activeClass': false,
              'routeLink' : '/gdpr-compliance',
              'linkText' : 'GDPR compliance'
            };
            if((data['canadian_commercial_company'] === true || data['canadian_commercial_company'] === false) || (data['usa_privacy_shield'] === true || data['usa_privacy_shield'] === false) || data['dta_doc_link']){
              if(data['usa_privacy_shield'] === true) this.us_privacy_shield = 'yes';
              if(data['usa_privacy_shield'] === false) this.us_privacy_shield = 'no';

              if(data['canadian_commercial_company'] === true) this.commercial_canada = 'yes';
              if(data['canadian_commercial_company'] === false) this.commercial_canada = 'no';

              gdprLink.activeClass = true;
              this.wizardLinks.push(gdprLink);
            }
            else this.wizardLinks.push(gdprLink);
          },
          error =>
          {
            if(error['message'] === 500 || error['message'] === 401) {
              localStorage.setItem('jwt_not_found', 'Jwt token not found');
              localStorage.removeItem('currentUser');
              localStorage.removeItem('googleUser');
              localStorage.removeItem('close_notify');
              localStorage.removeItem('linkedinUser');
              localStorage.removeItem('admin_log');
              window.location.href = '/login';
            }

            if(error['message'] === 403) this.router.navigate(['/not_found']);
          });
    }
    else this.router.navigate(['/not_found']);
  }

  gdprCompliance(){
    this.gdprCompliance_log = '';
    console.log('submitted');
    let errorCount = 0;
    let formData = new FormData();
    if(this.companyDoc['company_country'] === 'Canada') {
      if (this.commercial_canada && this.commercial_canada === 'no') {
        console.log(this.commercial_canada);
        formData.append('canadian_commercial_company', this.commercial_canada);
      }
      else {
        errorCount = 1;
        this.commercial_canada_error = 'Please choose an option';
      }
      if (this.commercial_canada && this.commercial_canada === 'yes') {
        errorCount = 0;
        formData.append('canadian_commercial_company', this.commercial_canada);
      }
    }

    if(this.companyDoc['company_country'] === 'United States') {
      if(this.us_privacy_shield && this.us_privacy_shield === 'no') {
        console.log(this.us_privacy_shield);
        formData.append('usa_privacy_shield', this.us_privacy_shield);
      }
      else {
        console.log('in else of usa_privacy_shield');
        errorCount = 1;
        this.us_privacy_shield_error = 'Please choose an option';
      }
      if (this.us_privacy_shield && this.us_privacy_shield === 'yes') {
        errorCount = 0;
        formData.append('usa_privacy_shield', this.us_privacy_shield);
      }
    }

    console.log('before 0 if');
    console.log(errorCount);
    if(errorCount === 0 && (this.us_privacy_shield === 'no' || this.commercial_canada === 'no')){
      let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#my_aa');
      let fileCount: number = inputEl.files.length;
      console.log('in 0 if');
      if (fileCount > 0) {
        let toArray = inputEl.files.item(0).type.split("/");
        if (inputEl.files.item(0).type === 'application/pdf') {
          console.log(inputEl.files.item(0));
          formData.append('company_logo', inputEl.files.item(0));
          console.log('send in DB a with file');
          this.sendDTADoc(formData);
        }
        else {
          this.gdprCompliance_log = 'Only pdf document is allowed';
        }
      }
      else {
        console.log('in else doc');
        this.gdprCompliance_log = 'Please upload signed DTA document';
      }
    }
    if(this.us_privacy_shield === 'yes' || this.commercial_canada === 'yes'){
      console.log('go in db yes with no file');
      //formData.append('company_logo', '');
      this.sendDTADoc(formData);
      //call a ftn
      //
    }
  }

  sendDTADoc(data){
    console.log('in sendDTADoc ftn');
    console.log(data);
    this.authenticationService.edit_company_profile(this.currentUser._id ,data , false)
    .subscribe(
      data => {
        if (data) {}
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

  upload_dtaDOc(){
    this.gdprCompliance_log = '';
    console.log('changed');
    let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#my_aa');
    let fileCount: number = inputEl.files.length;
    if (fileCount > 0){
      this.file_name = inputEl.files.item(0).name;
    }
  }

  selected_us_privacy_shield(event){
    this.us_privacy_shield = event.target.value;
    this.us_privacy_shield_error = '';
  }

}
