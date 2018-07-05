import { Component, OnInit,ElementRef, Input } from '@angular/core';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import { HttpClient } from '@angular/common/http';
import { DataService } from "../data.service";
import {NgForm} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
const URL = 'http://workonblockchain.mwancloud.com:4000/';
//const URL = 'http://localhost:4000/';

@Component({
  selector: 'app-about-company',
  templateUrl: './about-company.component.html',
  styleUrls: ['./about-company.component.css']
})
export class AboutCompanyComponent implements OnInit {
     info : any;
    currentUser: User;log;
    founded_log;employee_log;funded_log;des_log;image_src;
    company_founded;no_of_employees;company_funded;company_description;terms_active_class;about_active_class;
  constructor(private route: ActivatedRoute,
        private router: Router,private http: HttpClient,
        private authenticationService: UserService,private dataservice: DataService,private el: ElementRef) {
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
                   if(data.company_founded || data.no_of_employees || data.company_funded || data.company_description ||data.company_logo)
                  {
                     this.company_founded=data.company_founded;
                     this.no_of_employees=data.no_of_employees;
                     this.company_funded=data.company_funded;
                     this.company_description =data.company_description;
                       if(data.company_logo != null){
                       this.image_src  = '/var/www/html/workonblockchain/server/uploads/' + data.company_logo;
                           }
                       
                      //this.router.navigate(['/login']);
                  }
                 if(data.company_declare && data.company_pay  && data.company_found && data.only_summary)
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
                  
                });
       }
      else
       {
           
           this.router.navigate(['/not_found']);
           
           }
  }
    
    about_company(companyForm: NgForm) 
    {
         console.log(companyForm.value);
        if(!companyForm.value.company_founded)
        {
            this.founded_log = 'Please fill when was the company founded';
            console.log(this.founded_log);
        }
        else
        {
            this.founded_log='';
        }
        if(!companyForm.value.no_of_employees)
        {
            this.employee_log = 'Please fill no. of employees';
           
        }
        else
        {
            this.employee_log='';
        }
        
        if(!companyForm.value.company_funded)
        {
            this.funded_log = 'Please fill how is the company funded';
            
        }
        else
        {
             this.funded_log='';
         }
        
        if(!companyForm.value.company_description)
        {
            this.des_log = 'Please fill Company Description';
            
        }
        else
        {   
        this.des_log=''
      
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
              console.log("data");
                formData.append('photo', inputEl.files.item(0));
                    
                this.http.post(URL+'users/employer_image/'+this.currentUser._creator, formData).map((res) => res).subscribe(                
                (success) => 
                {
                  console.log(success);
                  this.router.navigate(['/company_profile']); 
                },
                (error) => alert(error))
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
            this.log = 'Something getting wrong';
          });
            }
          }
       
 
}
