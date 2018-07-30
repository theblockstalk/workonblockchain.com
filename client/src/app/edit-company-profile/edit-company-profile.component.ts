import { Component, OnInit,ElementRef, Input  } from '@angular/core';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import { HttpClient } from '@angular/common/http';
import { DataService } from "../data.service";
import {NgForm} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//const URL = 'http://workonblockchain.mwancloud.com:4000/';
//const URL = 'http://localhost:4000/';
import {environment} from '../../environments/environment';
const URL = environment.backend_url;
////console.log(URL);


@Component({
  selector: 'app-edit-company-profile',
  templateUrl: './edit-company-profile.component.html',
  styleUrls: ['./edit-company-profile.component.css']
})
export class EditCompanyProfileComponent implements OnInit {
        
   info : any;
    currentUser: User;log;
    founded_log;employee_log;funded_log;des_log;image_src;
    company_founded;no_of_employees;company_funded;company_description;
    last_name;first_name;job_title;company_website;company_name;company_phone;
    company_country;company_city;company_postcode;image;
    img_data;
    img_src;
    

 constructor(private route: ActivatedRoute,
        private router: Router,private http: HttpClient,
        private authenticationService: UserService,private dataservice: DataService,private el: ElementRef) {
       }

  ngOnInit()
  {
      
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
                  //console.log(data);
                  if(data.company_founded && data.no_of_employees && data.company_funded && data.company_description)
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
                
                  if(data.first_name && data.last_name && data.job_title && data.company_name && data.company_website &&
                  data.company_phone && data.company_postcode)
                  {
                     this.first_name= data.first_name;
                      this.last_name=data.last_name;
                      this.job_title =data.job_title;
                      this.company_name=data.company_name;
                      this.company_website=data.company_website;
                      this.company_phone=data.company_phone;
                      this.company_country=data.company_country;
                      this.company_city =data.company_city;
                      this.company_postcode = data.company_postcode;
                     
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
    
  company_profile(profileForm: NgForm)
  {
      //console.log(profileForm.value);
       this.authenticationService.edit_company_profile(this.currentUser._creator,profileForm.value)
            .subscribe(
                data => {
                if(data && this.currentUser)
                {
                     let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#aa');
                     let fileCount: number = inputEl.files.length;
                     let formData = new FormData();
                     if (fileCount > 0 ) 
                     { 
                        formData.append('photo', inputEl.files.item(0));
                    
                        this.http.post(URL+'users/employer_image/'+this.currentUser._creator, formData).map((res) => res).subscribe(                
                        (success) => 
                        {
                             //console.log(success);
                             window.location.href = '/company_profile';

                              //this.router.navigate(['/candidate_profile']); 
                        },
                        (error) => console.log(error))
                     }
                     else
                          window.location.href = '/company_profile';

                        //this.router.navigate(['/candidate_profile']);
                }

                if(data.error)
                {
                    //this.log=data.error;
                    this.dataservice.changeMessage(data.error);
                }
               
                },
                error => {
                     this.dataservice.changeMessage(error);
                  this.log = 'Something getting wrong';
                   
                });
  }

}
