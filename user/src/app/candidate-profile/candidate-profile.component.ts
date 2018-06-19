import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormArray, FormGroup,Validators } from '@angular/forms';
import {NgForm} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-candidate-profile',
  templateUrl: './candidate-profile.component.html',
  styleUrls: ['./candidate-profile.component.css']
})
export class CandidateProfileComponent implements OnInit {
        currentUser: User;
        first_name;last_name;description;companyname;degreename;
        interest_area;why_work;availability_day;
        countries;commercial;history;education;
        experimented;languages;current_currency;current_salary;image_src;
        imgPath;nationality;contact_number;

 constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router,
        private authenticationService: UserService) { }

  ngOnInit() 
  {
      
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
     
      if(!this.currentUser)
       {
          this.router.navigate(['/login']);
       }
       if(this.currentUser && this.currentUser.type == 'candidate')
       {
          this.authenticationService.getById(this.currentUser._id)
            .subscribe(
            data => {
               
                
                if(!data.contact_number && !data.nationality && !data.first_name && !data.last_name)
                {
                        this.router.navigate(['/about']);
                }
               else if(data.country.length < 1  && data.roles.length < 1 && data.interest_area.length < 1 || !data.expected_salary)
               {
                 
                    this.router.navigate(['/job']); 
                }
                else if(data.commercial_platform.length < 1 && data.experimented_platform.length < 1  || !data.why_work )
                {
                    this.router.navigate(['/resume']);
                }
                //console.log(data.experience_roles.length);
                else if(data.experience_roles.length < 1  &&  !data.current_salary )
                {
                        this.router.navigate(['/experience']);
                }
                else 
                {
                    this.first_name=data.first_name;
                    this.last_name =data.last_name;
                    this.nationality = data.nationality;
                    this.contact_number =data.contact_number;
                    this.description =data.description;
                    this.history =data.history;
                    this.education = data.education;
                    
                    for(let data1 of data.history)
                    {
                        this.companyname = data1.companyname;
                       
                    }
                    for(let edu of data.education)
                    {
                        this.degreename = edu.degreename;
                    }
                    this.countries = data.country;
                    this.interest_area =data.interest_area;
                    this.availability_day =data.availability_day;
                    this.why_work = data.why_work;
                    this.commercial = data.commercial_platform;
                    this.experimented = data.experimented_platform;
                    this.languages= data.experience_roles;
                    this.current_currency = data.current_currency;
                    this.current_salary = data.current_salary;
                    if(data.image != null )
                    {
                      //console.log(data.image);
                     this.image_src =  data.image ;
                        this.imgPath = '/var/www/html/workonblockchain/server/uploads/';
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
