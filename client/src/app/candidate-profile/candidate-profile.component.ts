import { Component,OnInit, ElementRef, AfterViewInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormArray, FormGroup,Validators } from '@angular/forms';
import {NgForm} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute,NavigationEnd  } from '@angular/router';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import { HttpClient } from '@angular/common/http';
import { DataService } from "../data.service";
import {environment} from '../../environments/environment';
import { Location } from '@angular/common';


@Component({
  selector: 'app-candidate-profile',
  templateUrl: './candidate-profile.component.html',
  styleUrls: ['./candidate-profile.component.css']
})
export class CandidateProfileComponent implements OnInit ,  AfterViewInit {
    
    @ViewChild('element') element: ElementRef;
 
        currentUser: User;
        first_name;last_name;description;companyname;degreename;
        interest_area;why_work;availability_day;
        countries;commercial;history;education;
        experimented;languages;current_currency;current_salary;image_src;
        imgPath;nationality;contact_number;id;
        share_link;
    text;
    platforms;
    cand_id;htmlContent;
    info;
    share_url;
   shareurl;
   url;
    user_id;
    public_data;
    github;
    stack;
    roles;
     expected_currency;
    expected_salary;
    email;
    currentwork;
    message;
 constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router,
        private authenticationService: UserService,private dataservice: DataService,location: Location) 
 { 
   
     
 }
    sectionScroll;
    internalRoute(page,dst){
    this.sectionScroll=dst;
    this.router.navigate([page], {fragment: dst});
}
    
    doScroll() {

    if (!this.sectionScroll) {
      return;
    }
    try {
      var elements = document.getElementById(this.sectionScroll);

      elements.scrollIntoView();
    }
    finally{
      this.sectionScroll = null;
    }
  } 


     ngAfterViewInit(): void 
     {
         window.scrollTo(0, 0);
     
       /* this.element.nativeElement.innerHTML = `<script type="IN/Share" data-url="${this.share_url}" data-text = "${this.tweet_text}"></script>`;
 
         render share button
        window['IN'] && window['IN'].parse();
         
         
          window['twttr'] && window['twttr'].widgets.load();*/
         
    }
    tweet_text;
 
  ngOnInit() 
  {     
  
       this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      this.doScroll();
      this.sectionScroll= null;
    });
  
      this.dataservice.eemailMessage.subscribe(message => this.message = message);
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));  
      console.log(this.currentUser);
      this.tweet_text = "@work_blockchain I am looking to work on blockchain projects now!"; 
      if(this.user_id)
      {
          ////console.log("ifffffff");
         
          /*this.share_url = location.href + '?user=' + this.user_id;
          this.authenticationService.public_profile(this.user_id)
            .subscribe(
            data => {
                this.public_data = data;
                //console.log(data);
                });*/
          
      }
     
      else
       {
          ////console.log("elseeeee");
          //this.share_url = location.href + '?user=' + this.currentUser._creator;
          if(!this.currentUser)
       {
          this.router.navigate(['/login']);
       }
       if(this.currentUser && this.currentUser.type == 'candidate')
       {
           this.cand_id= this.currentUser._creator;
           
          
          this.authenticationService.getById(this.currentUser._id)
            .subscribe(
            data => {
                
                if(!data.terms || data.terms == false)
                {
                     this.router.navigate(['/terms-and-condition']);
                    
                }
              
               else if(!data.contact_number || !data.nationality || !data.first_name || !data.last_name)
               {
                        this.router.navigate(['/about']);
               }
               else if(data.locations.length < 1  || data.roles.length < 1 || data.interest_area.length < 1 || !data.expected_salary)
               {
                 
                    this.router.navigate(['/job']); 
                }
                else if(!data.why_work )
                {
                    this.router.navigate(['/resume']);
                }
               /* else if(data.commercial_platform.length < 1 || data.experimented_platform.length < 1  || data.platforms.length < 1)
                {
                    this.router.navigate(['/resume']);
                }*/
                //////console.log(data.programming_languages.length);
                else if(!data.programming_languages ||  !data.current_salary  || data.programming_languages.length <1 )
                {
                        this.router.navigate(['/experience']);
                }
                    
                 else if(!data.description)
                {
                    this.router.navigate(['/experience']);
                    
                }
                /*else if(data.work_history.length < 1 || !data.work_history.length )
                {
                   // this.dataservice.changeMessage("Please enter atleast one work history record");
                    this.router.navigate(['/experience']);              
                }
                    
                else if(data.education_history.length < 1 || !data.education_history.length )
                {
                    //this.dataservice.changeMessage("Please enter atleast one education record");
                    this.router.navigate(['/experience']);
                    
                }*/
                    
                else 
                {
                  
                    this.id = data._creator._id; 
                    this.email =data._creator.email;  
                    
                    if(data.github_account)
                    {
                      this.github=data.github_account;   
                    }
                    if(data.stackexchange_account)
                    {
                      this.stack=data.stackexchange_account;   
                    }
                                       
                    this.expected_currency = data.expected_salary_currency;
                    this.expected_salary = data.expected_salary;
                    this.first_name=data.first_name;
                    this.last_name =data.last_name;
                    this.nationality = data.nationality;
                    this.contact_number =data.contact_number;
                    this.description =data.description;
                    this.history =data.work_history;
                    this.education = data.education_history;
                    console.log(this.history);
                    for(let data1 of data.work_history)
                    {
                        this.companyname = data1.companyname;
                        this.currentwork = data1.currentwork;
                       
                    }
                    for(let edu of data.education_history)
                    {
                        this.degreename = edu.degreename;
                    }
                    this.countries = data.locations;
                    this.interest_area =data.interest_area;
                    this.roles  = data.roles;
                    this.availability_day =data.availability_day;
                    this.why_work = data.why_work;
                    this.commercial = data.commercial_platform;
                    this.experimented = data.experimented_platform;
                    this.languages= data.programming_languages;
                    this.current_currency = data.current_currency;
                    this.current_salary = data.current_salary;

                    this.platforms=data.platforms;
                    if(data.image != null )
                    {
                        
                        this.imgPath = data.image;
                        ////console.log(this.imgPath);
                        
                    }

                   
                }
                

            },
            err =>
            {
                if(err.message == 500 || err.message == 401)
                    {
                        localStorage.setItem('jwt_not_found', 'Jwt token not found');
                        window.location.href = '/login';
                    }
            });
       }
       else
       {
           this.router.navigate(['/not_found']);
       }
          
         }
     
      

  }

}
