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

   constructor(private route: ActivatedRoute,
        private router: Router,
        private authenticationService: UserService,private dataservice: DataService) {
       }
  

  ngOnInit() {
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
                  console.log(data);
                 if(data.company_declare || data.company_pay  || data.company_found || data.only_summary)
                  {
                      this.company_pay = data.company_pay;
                      this.company_declare = data.company_declare;
                      this.company_found =data.company_found;
                      this.only_summary =data.only_summary;
                      this.about_company = '/about_comp';
                  }
                    
                    if(data.company_declare && data.company_pay  && data.company_found && data.only_summary)
                  {
                        this.terms_active_class = 'fa fa-check-circle text-success';
                        }
                    
                     if(data.company_founded && data.no_of_employees && data.company_funded && data.company_description)
                  {
                     this.about_active_class = 'fa fa-check-circle text-success';
                   }
                  
                },
                error => 
                {
                  
                });
       }
      else
       {
           this.router.navigate(['/not_found']);
           }
  }
    
    terms_wizard(termsForm: NgForm) 
    {
         console.log(termsForm.value);
        if(termsForm.value.company_pay == true && termsForm.value.company_declare == true  && termsForm.value.company_found== true && termsForm.value.only_summary == true)
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
                  this.log = 'Something getting wrong';
                   
                });
          }
        else
            {
            this.log = 'Please agree with all terms and conditions to move forward';
          
            }
    }

}
