import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import { HttpClient } from '@angular/common/http';
import { DataService } from "../data.service";
import {NgForm} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-terms-wizard',
  templateUrl: './terms-wizard.component.html',
  styleUrls: ['./terms-wizard.component.css']
})
export class TermsWizardComponent implements OnInit {
        info : any;
        currentUser: User;log;
        company_pay;company_declare;company_found;only_summary;about_company;
    terms_active_class;about_active_class;
    termscondition;
    marketing_emails;
    agree;
    about_disable;
    terms_id = '';

   constructor(private route: ActivatedRoute,
        private router: Router,
        private authenticationService: UserService,private dataservice: DataService) {
       }


  ngOnInit() {
      this.about_disable= "disabled";
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
                  ////console.log(data);
                    this.marketing_emails = data.marketing_emails;
                  this.authenticationService.get_page_content('Terms and Condition for company')
                  .subscribe(
                    data => {
                      if(data)
                      {
                        this.terms_id = data._id;
                        //console.log(this.editor_content);
                      }
                    }
                  );
                 if(data.terms)
                  {
                      this.termscondition = data.terms;
                      this.marketing_emails = data.marketing_emails;

                      this.about_company = '/about_comp';

                  }

                  if(data.terms == true)
                  {
                       this.about_disable='';
                        this.terms_active_class = 'fa fa-check-circle text-success';
                       this.about_company = '/about_comp';
                        }

                     if(data.company_founded && data.no_of_employees && data.company_funded && data.company_description)
                  {
                     this.about_active_class = 'fa fa-check-circle text-success';
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
       //console.log(termsForm.value);
       if(this.termscondition!=true)
       {
           //console.log("if");
        this.terms_log = "Please accept terms and condition";
       }
        else
        {
        this.authenticationService.company_terms(this.currentUser._creator,termsForm.value)
            .subscribe(
                data => {
                if(data && this.currentUser)
                {
                    this.router.navigate(['/about_comp']);
                }

                if(data.error )
                {
                    this.log=data.error;
                }

                },
                error => {
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
                        this.router.navigate(['/not_found']);
                    }

                });
          }
    }

}
