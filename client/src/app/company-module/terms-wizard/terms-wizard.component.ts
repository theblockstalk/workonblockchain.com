import { Component, OnInit } from '@angular/core';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
import { HttpClient } from '@angular/common/http';
import { DataService } from "../../data.service";
import {NgForm} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-terms-wizard',
  templateUrl: './terms-wizard.component.html',
  styleUrls: ['./terms-wizard.component.css']
})
export class TermsWizardComponent implements OnInit {
  info : any;
  currentUser: any;log;
  about_company;
  terms_active_class;about_active_class;
  termscondition;
  marketing_emails;
  agree;
  about_disable;
  terms_id;
  preference;
  pref_active_class;
  pref_disable;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private authenticationService: UserService,private dataservice: DataService) {
  }


  ngOnInit() {
    this.about_disable= "disabled";
    this.pref_disable = "disabled";
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if(!this.currentUser)
    {
      this.router.navigate(['/login']);
    }
    else if(this.currentUser && this.currentUser.type=='company')
    {
      this.authenticationService.get_page_content('Terms and Condition for company')
      .subscribe(
        data => {
          if(data)
          {
            this.terms_id = data['_id'];
          }
        }
      );
      this.authenticationService.getCurrentCompany(this.currentUser._id)
        .subscribe(
          data =>
          {
            this.marketing_emails = data['marketing_emails'];
            if(data['terms_id'])
            {
              this.termscondition = true;
              this.marketing_emails = data['marketing_emails'];

              this.about_company = '/about_comp';

            }

            if(data['terms_id'])
            {
              this.about_disable='';
              this.terms_active_class = 'fa fa-check-circle text-success';
              this.about_company = '/about_comp';
              this.preference  = '/preferences';

            }

            if(data['company_founded'] && data['no_of_employees'] && data['company_funded'] && data['company_description'])
            {
              this.pref_disable = '';
              this.about_active_class = 'fa fa-check-circle text-success';
              this.preference  = '/preferences';

            }
            if(data['saved_searches'] && data['saved_searches'].length > 0) {
              this.pref_active_class = 'fa fa-check-circle text-success';
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
  terms_log;
  terms_wizard(termsForm: NgForm)
  {
    if(this.termscondition!=true)
    {
      this.terms_log = "Please accept terms and condition";
    }
    else
    {
      let queryBody: any = {};
      queryBody.terms_id = termsForm.value.termsID;
      queryBody.marketing_emails = termsForm.value.marketing;

      this.authenticationService.company_terms(this.currentUser._id, queryBody)
        .subscribe(
          data => {
            if(data && this.currentUser)
            {
              this.router.navigate(['/about_comp']);
            }


          },
          error => {
            if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              this.log = error['error']['message'];
            }
            else if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              this.log = error['error']['message'];
            }
            else {
              this.log = "Something went wrong";
            }

          });
    }
  }

}
