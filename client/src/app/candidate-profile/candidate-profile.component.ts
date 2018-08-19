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
   const url = 'https://platform.linkedin.com/in.js';
        if (!document.querySelector(`script[src='${url}']`)) {
            let script = document.createElement('script');
            script.src = url;
            script.innerHTML = 'lang: en_US';
            document.body.appendChild(script);
        }
     
     const url2 = 'https://platform.twitter.com/widgets.js';
        if (!document.querySelector(`script[src='${url2}']`)) {
            let script = document.createElement('script');
            script.src = url2;
            document.body.appendChild(script);
        }     
     
     this.route.queryParams.subscribe(params => {
        this.user_id = params['user'];
        ////console.log(this.user_id); 
    });
     
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
      this.tweet_text = "@work_blockchain I am looking to work on blockchain projects now!"; 
      if(this.user_id)
      {
          ////console.log("ifffffff");
         
          this.share_url = location.href + '?user=' + this.user_id;
          this.authenticationService.public_profile(this.user_id)
            .subscribe(
            data => {
                this.public_data = data;
                //console.log(data);
                });
          
      }
     
      else
       {
          ////console.log("elseeeee");
          this.share_url = location.href + '?user=' + this.currentUser._creator;
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
                
                if(!data[0].terms || data[0].terms == false)
                {
                     this.router.navigate(['/terms-and-condition']);
                    
                }
              
               else if(!data[0].contact_number || !data[0].nationality || !data[0].first_name || !data[0].last_name)
               {
                        this.router.navigate(['/about']);
               }
               else if(data[0].locations.length < 1  || data[0].roles.length < 1 || data[0].interest_area.length < 1 || !data[0].expected_salary)
               {
                 
                    this.router.navigate(['/job']); 
                }
                else if(!data[0].why_work )
                {
                    this.router.navigate(['/resume']);
                }
               /* else if(data[0].commercial_platform.length < 1 || data[0].experimented_platform.length < 1  || data[0].platforms.length < 1)
                {
                    this.router.navigate(['/resume']);
                }*/
                //////console.log(data[0].programming_languages.length);
                else if(!data[0].programming_languages ||  !data[0].current_salary  || data[0].programming_languages.length <1 )
                {
                        this.router.navigate(['/experience']);
                }
                    
                 else if(!data[0].description)
                {
                    this.router.navigate(['/experience']);
                    
                }
                /*else if(data[0].work_history.length < 1 || !data[0].work_history.length )
                {
                   // this.data[0]service.changeMessage("Please enter atleast one work history record");
                    this.router.navigate(['/experience']);              
                }
                    
                else if(data[0].education_history.length < 1 || !data[0].education_history.length )
                {
                    //this.data[0]service.changeMessage("Please enter atleast one education record");
                    this.router.navigate(['/experience']);
                    
                }*/
                    
                else 
                {
                  
                    this.id = data[0]._creator._id; 
                    this.email =data[0]._creator.email;  
                    
                    if(data[0].github_account)
                    {
                      this.github=data[0].github_account;   
                    }
                    if(data[0].stackexchange_account)
                    {
                      this.stack=data[0].stackexchange_account;   
                    }
                                       
                    this.expected_currency = data[0].expected_salary_currency;
                    this.expected_salary = data[0].expected_salary;
                    this.first_name=data[0].first_name;
                    this.last_name =data[0].last_name;
                    this.nationality = data[0].nationality;
                    this.contact_number =data[0].contact_number;
                    this.description =data[0].description;
                    this.history =data[0].work_history;
                    this.education = data[0].education_history;
                    console.log(this.history);
                    for(let data1 of data[0].work_history)
                    {
                        this.companyname = data1.companyname;
                        this.currentwork = data1.currentwork;
                       
                    }
                    for(let edu of data[0].education_history)
                    {
                        this.degreename = edu.degreename;
                    }
                    this.countries = data[0].locations;
                    this.interest_area =data[0].interest_area;
                    this.roles  = data[0].roles;
                    this.availability_day =data[0].availability_day;
                    this.why_work = data[0].why_work;
                    this.commercial = data[0].commercial_platform;
                    this.experimented = data[0].experimented_platform;
                    this.languages= data[0].programming_languages;
                    this.current_currency = data[0].current_currency;
                    this.current_salary = data[0].current_salary;

                    this.platforms=data[0].platforms;
                    if(data[0].image != null )
                    {
                        
                        this.imgPath = data[0].image;
                        ////console.log(this.imgPath);
                        
                    }

                   
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
