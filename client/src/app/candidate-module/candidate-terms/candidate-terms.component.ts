import { Component, OnInit,AfterViewInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
declare var synapseThrow: any;
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';

@Component({
  selector: 'app-candidate-terms',
  templateUrl: './candidate-terms.component.html',
  styleUrls: ['./candidate-terms.component.css']
})
export class CandidateTermsComponent implements OnInit,AfterViewInit {
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
    prefill_link;
    prefill_disable;
    term_active_class;
    privacy_id;

  constructor(private http: HttpClient,private route: ActivatedRoute,private router: Router,private authenticationService: UserService)
    {

      }

    about_disable;
    job_disable;
    resume_disable;
    exp_disable;
     ngAfterViewInit(): void
     {
         window.scrollTo(0, 0);

    }
  terms_id = '';
  ngOnInit()
  {

      this.about_disable = "disabled";
      this.job_disable = "disabled";
      this.resume_disable = "disabled";
      this.exp_disable = "disabled";
      this.prefill_disable = "disabled";
       this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

      if(this.currentUser && this.currentUser.type=='candidate')
       {

           this.authenticationService.getCandidateProfileById(this.currentUser._id, false)
            .subscribe(
                data =>
                {
                  this.authenticationService.get_page_content('Terms and Condition for candidate')
                  .subscribe(
                    data => {
                      if(data)
                      {
                        this.terms_id = data['_id'];
                      }
                    }
                  );

                  this.authenticationService.get_page_content('Privacy Notice')
                  .subscribe(
                    data => {
                      if(data)
                      {
                        this.privacy_id = data['_id'];
                      }
                    }
                  );

                  if(data['candidate'].terms_id ||data['marketing_emails'])
                  {

                    this.termscondition = true;
                    this.marketing_emails = data['marketing_emails'];

                  }
                  if(data['candidate'].terms_id)
                  {
                      this.about_disable = "";
                      this.prefill_disable = "";
                      this.active_class='fa fa-check-circle text-success';
                      this.term_active_class = 'fa fa-check-circle text-success';
                      this.prefill_link = '/prefill-profile';
                      this.about_link="/about";
                  }
                  if(!data['candidate'].terms_id)
                  {
                    this.termscondition = false;
                  }

                  if(data['contact_number']  && data['nationality'])
                  {
                      this.job_disable = "";
                      this.about_active_class = 'fa fa-check-circle text-success';
                      this.about_link="/about";
                      this.link="/work";
                  }

                  if(data['candidate'].employee || data['candidate'].contractor || data['candidate'].volunteer)
                  {
                       this.resume_disable = "";
                      this.link="/work";
                      this.resume_class="/resume";
                      this.job_active_class = 'fa fa-check-circle text-success';

                  }


                    if(data['candidate'].why_work && data['candidate'].interest_areas )
                    {
                        this.exp_disable = "";
                        this.resume_class="/resume";
                        this.exp_class = "/experience";
                        this.resume_active_class='fa fa-check-circle text-success';
                    // this.router.navigate(['/resume']);
                    }

                    if(data['candidate'].description)
                    {
                        this.exp_class = "/experience";
                        this.exp_active_class = 'fa fa-check-circle text-success';
                        //this.router.navigate(['/experience']);
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
      if(this.termscondition === false)
      {
          this.terms_log = "Please accept terms and conditions";
      }
      else
      {
        let queryBody: any = {};
        queryBody.marketing_emails = termsForm.value.marketing;
        queryBody.terms_id = this.terms_id;
        //queryBody.privacy_id = this.privacy_id;

        this.authenticationService.account_settings(queryBody)
        .subscribe(
          data =>
          {
              if(data)
              {
                  this.router.navigate(['/prefill-profile']);
              }
          },
          error=>
          {
            if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false)
            {
                this.router.navigate(['/prefill-profile']);
            }
        }
      );
    }
  }

}
