import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {UserService} from '../../user.service';

@Component({
  selector: 'app-gdpr-compliance',
  templateUrl: './gdpr-compliance.component.html',
  styleUrls: ['./gdpr-compliance.component.css']
})
export class GDPRComplianceComponent implements OnInit {

  currentUser;terms_active_class;about_active_class;pref_active_class;
  price_plan_active_class;gdpr_compliance_active_class;
  wizardLinks = [];

  constructor( private router: Router, private authenticationService: UserService) { }

  ngOnInit() {
    console.log('in GDPRComplianceComponent');
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if(!this.currentUser) this.router.navigate(['/login']);
    else if(this.currentUser && this.currentUser.type=='company') {
      this.authenticationService.getCurrentCompany(this.currentUser._id, false)
        .subscribe(
          data =>
          {
            console.log(data);
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
            if(data['dta_doc_link']){
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
    console.log('submitted');
  }

}
