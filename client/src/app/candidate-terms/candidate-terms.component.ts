import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
declare var synapseThrow: any;
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../user.service';
import {User} from '../Model/user';

@Component({
  selector: 'app-candidate-terms',
  templateUrl: './candidate-terms.component.html',
  styleUrls: ['./candidate-terms.component.css']
})
export class CandidateTermsComponent implements OnInit {
    terms ;
    agree;
    currentUser: User;
    termscondition=false;
    class;
    resume_class;
    exp_class;
    final_class;
    active_class;
    link;
    job_active_class;
    resume_active_class;
    exp_active_class;
    log;
    about_active_class;
    about_link;
    marketing_emails;
    
  constructor(private http: HttpClient,private route: ActivatedRoute,private router: Router,private authenticationService: UserService) 
    {
      
      }
    
    about_disable;
    job_disable;
    resume_disable;
    exp_disable;
    
  ngOnInit() 
  {
     
      this.about_disable = "disabled";
      this.job_disable = "disabled";
      this.resume_disable = "disabled";
      this.exp_disable = "disabled";
      //console.log(this.termscondition);
       this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
       //console.log(this.currentUser);
      
      if(this.currentUser && this.currentUser.type=='candidate')
       {
         
           this.authenticationService.getById(this.currentUser._id)
            .subscribe(
                data => 
                {
                  //console.log(data); 
                  
                  if(data[0].terms ||data[0].marketing_emails)
                  {
                    
                    this.termscondition = data[0].terms;
                    this.marketing_emails = data[0].marketing_emails;  
                              
                  }
                  if(data[0].terms == true)
                  {
                      this.about_disable = "";
                      this.active_class='fa fa-check-circle text-success';
                      this.about_link="/about";
                  }
                  if(!data[0].terms)
                  {
                    this.termscondition = false;
                  }
                    
                  if(data[0].contact_number  && data[0].nationality && data[0].first_name && data[0].last_name)
                  {
                      this.job_disable = "";
                      this.about_active_class = 'fa fa-check-circle text-success';
                      this.about_link="/about";
                      this.link="/job";
                  }
                    
                  if(data[0].locations && data[0].roles && data[0].interest_area && data[0].expected_salary && data[0].availability_day )
                  {
                       this.resume_disable = "";
                      this.link="/job";
                      this.resume_class="/resume";
                      this.job_active_class = 'fa fa-check-circle text-success';
                       
                  }
                    
               
                    if(data[0].why_work )
                    {
                        this.exp_disable = "";
                        this.resume_class="/resume";
                        this.exp_class = "/experience";
                        this.resume_active_class='fa fa-check-circle text-success';
                    // this.router.navigate(['/resume']);
                    }
     
                    if(data[0].work_history && data[0].education_history && data[0].programming_languages && data[0].current_salary )
                    {
                        this.exp_class = "/experience";
                        this.exp_active_class = 'fa fa-check-circle text-success';
                        //this.router.navigate(['/experience']);
                    }
                 
                  

              
                  
                },
                error => 
                {
                  this.log = 'Something getting wrong';
                });
              
       }
       else
       {
            this.router.navigate(['/not_found']);
       }
  }
    

  terms_log;
  terms_and_condition(termsForm: NgForm)
  {   
    //console.log(termsForm.value);
      
      if(this.termscondition == false)
      {
          this.terms_log = "Please accept terms and conditions";
      }
      else
      {
        this.authenticationService.terms(this.currentUser._creator,termsForm.value)
        .subscribe(
          data => 
          {
              if(data)
              {
                  this.router.navigate(['/about']);
              }
              
          });
       }
  }

}
