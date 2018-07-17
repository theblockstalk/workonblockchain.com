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
  ngOnInit() 
  {
     
      
      console.log(this.termscondition);
       this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
       console.log(this.currentUser);
      
      if(this.currentUser && this.currentUser.type=='candidate')
       {
         
           this.authenticationService.getById(this.currentUser._id)
            .subscribe(
                data => 
                {
                  console.log(data);
                 
                  
                  if(data.terms ||data.marketing_emails)
                  {
                    
                    this.termscondition = data.terms;
                    this.marketing_emails = data.marketing_emails;  
                              
                  }
                  if(data.terms == true)
                  {
                      
                      this.active_class='fa fa-check-circle text-success';
                      this.about_link="/about";
                  }
                  if(!data.terms)
                  {
                    this.termscondition = false;
                  }
                    
                  if(data.contact_number  && data.nationality && data.first_name && data.last_name)
                  {
                      
                      this.about_active_class = 'fa fa-check-circle text-success';
                      this.about_link="/about";
                      this.link="/job";
                  }
                    
                  if(data.country && data.roles && data.interest_area && data.expected_salary && data.availability_day )
                  {
                      this.link="/job";
                      this.resume_class="/resume";
                      this.job_active_class = 'fa fa-check-circle text-success';
                       
                  }
                    
               
                    if(data.commercial_platform && data.experimented_platform && data.why_work &&data.platforms)
                    {
                        this.resume_class="/resume";
                        this.exp_class = "/experience";
                        this.resume_active_class='fa fa-check-circle text-success';
                    // this.router.navigate(['/resume']);
                    }
     
                    if(data.history && data.education && data.experience_roles && data.current_salary )
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
    

    
  terms_and_condition(termsForm: NgForm)
  {   
    console.log(termsForm.value);
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
