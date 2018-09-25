import { Component, OnInit,ElementRef, Input,AfterViewInit } from '@angular/core';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { DataService } from "../data.service";
import {NgForm} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//const URL = 'http://workonblockchain.mwancloud.com:4000/';
//const URL = 'http://localhost:4000/';
import {environment} from '../../environments/environment';
const URL = environment.backend_url;
//////console.log(URL);


@Component({
  selector: 'app-about-company',
  templateUrl: './about-company.component.html',
  styleUrls: ['./about-company.component.css']
})
export class AboutCompanyComponent implements OnInit,AfterViewInit {
     info : any;
    currentUser: User;log;
    founded_log;employee_log;funded_log;des_log;image_src;
    company_founded;no_of_employees;company_funded;company_description;terms_active_class;about_active_class;image;
    img_data;
   img_src;
    text;
  constructor(private route: ActivatedRoute,
        private router: Router,private http: HttpClient,
        private authenticationService: UserService,private dataservice: DataService,private el: ElementRef) {
       }
    
     ngAfterViewInit(): void 
     {
         window.scrollTo(0, 0);   
         
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
 
                  ////console.log(data);
                   if(data.company_founded || data.no_of_employees || data.company_funded || data.company_description ||data.company_logo)
                  {
                     this.company_founded=data.company_founded;
                     this.no_of_employees=data.no_of_employees;
                     this.company_funded=data.company_funded;
                     this.company_description =data.company_description;
                       if(data.company_logo != null){
                       this.img_data  =  data.company_logo;

                        let x = this.img_data.split("/");
     
                        let last:any = x[x.length-1];
                           
                           this.img_src = last;

                           }
                       
                      //this.router.navigate(['/login']);
                  }
                 if(data.terms === true)
                  {
                    this.terms_active_class = 'fa fa-check-circle text-success';
                      //this.router.navigate(['/login']);
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
                            // this.router.navigate(['/not_found']);                        
                        } 
                });
       }
      else
       {
           
           this.router.navigate(['/not_found']);
           
           }
  }
    
    about_company(companyForm: NgForm) 
    {
         ////console.log(companyForm.value);
        if(!this.company_founded)
        {
            this.founded_log = 'Please fill when was the company founded';
            ////console.log(this.founded_log);
        }
       
        if(!this.no_of_employees)
        {
            this.employee_log = 'Please fill no. of employees';
           
        }
       
        
        if(!this.company_funded)
        {
            this.funded_log = 'Please fill how is the company funded';
            
        }
       
        
        if(!this.company_description)
        {
            this.des_log = 'Please fill Company Description';
            
        }
        if(this.company_founded && this.no_of_employees && this.company_funded && this.company_description)
        {   
        
      
       this.authenticationService.about_company(this.currentUser._creator,companyForm.value)
        .subscribe(
          data => 
          {
            if(data)
            {
              
              let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#aa');
              let fileCount: number = inputEl.files.length;
              let formData = new FormData();
              if (fileCount > 0 ) 
              { 
              ////console.log("data");
                formData.append('photo', inputEl.files.item(0));
                    
                this.http.post(URL+'users/employer_image', formData , {
                    headers: new HttpHeaders().set('Authorization', this.currentUser.jwt_token)
                }).map((res) => res).subscribe(                
                (success) => 
                {
                  ////console.log(success);
                  this.router.navigate(['/company_profile']); 
                },
                (error) => {
                   if(error.message === 500 || error.message === 401)
                    {
                        localStorage.setItem('jwt_not_found', 'Jwt token not found');
                        window.location.href = '/login';
                    }
                    
                    if(error.message === 403)
                    {
                       // this.router.navigate(['/not_found']);                        
                    }  
                })
              }
               else
              {
                this.router.navigate(['/company_profile']);
              }
              
              }
             
              if(data.error )
            {
              this.log=data.error;
            }
            
            
          },
          error => 
          {
                    if(error.message === 500 || error.message === 401)
                    {
                        localStorage.setItem('jwt_not_found', 'Jwt token not found');
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
