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
                  
                  if(data.terms ||data.marketing_emails)
                  {
                    
                    this.termscondition = data.terms;
                    this.marketing_emails = data.marketing_emails;  
                              
                  }
                  if(data.terms == true)
                  {
                      this.about_disable = "";
                      this.active_class='fa fa-check-circle text-success';
                      this.about_link="/about";
                  }
                  if(!data.terms)
                  {
                    this.termscondition = false;
                  }
                    
                  if(data.contact_number  && data.nationality && data.first_name && data.last_name)
                  {
                      this.job_disable = "";
                      this.about_active_class = 'fa fa-check-circle text-success';
                      this.about_link="/about";
                      this.link="/job";
                  }
                    
                  if(data.locations && data.roles && data.interest_area && data.expected_salary && data.availability_day  && data.current_salary )
                  {
                       this.resume_disable = "";
                      this.link="/job";
                      this.resume_class="/resume";
                      this.job_active_class = 'fa fa-check-circle text-success';
                       
                  }
                    
               
                    if(data.why_work )
                    {
                        this.exp_disable = "";
                        this.resume_class="/resume";
                        this.exp_class = "/experience";
                        this.resume_active_class='fa fa-check-circle text-success';
                    // this.router.navigate(['/resume']);
                    }
     
                    if(data.programming_languages.length>0 &&data.description)
                    {
                        this.exp_class = "/experience";
                        this.exp_active_class = 'fa fa-check-circle text-success';
                        //this.router.navigate(['/experience']);
                    }
                 
                  

              
                  
                },
                error => 
                {
                  
                     if(error.message == 500 || error.message == 401)
                     {
                         localStorage.setItem('jwt_not_found', 'Jwt token not found');
                            window.location.href = '/login';
                         
                     }
                     else
                     {
                         
                    }
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
              
          },
          error=>
          {            
                     if(error.message == 500 || error.message == 401)
                     {
                         localStorage.setItem('jwt_not_found', 'Jwt token not found');
                            window.location.href = '/login';
                         
                     }
                     else
                     {
                         
                    }   
          });
       }
  }

}
