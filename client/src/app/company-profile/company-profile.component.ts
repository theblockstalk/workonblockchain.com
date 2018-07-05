import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit {
    
  currentUser: User; 
  first_name;last_name;company_name;job_title;company_website;company_phone;company_country;
  company_city;company_postcode;company_description;company_founded;company_funded;no_of_employees;
  constructor( private route: ActivatedRoute,
        private router: Router,
        private authenticationService: UserService) { }

  language_opt=
    [
      {name:'Java', value:'Java', checked:false},{name:'C', value:'C', checked:false},
      {name:'C++', value:'C++', checked:false},{name:'C#', value:'C#', checked:false},
      {name:'Python', value:'Python', checked:false},{name:'Visual Basic .NET', value:'Visual Basic .NET', checked:false},
      {name:'PHP', value:'PHP', checked:false},{name:'JavaScript', value:'JavaScript', checked:false},
      {name:'Delphi/Object Pascal', value:'Delphi/Object Pascal', checked:false},{name:'Swift', value:'Swift', checked:false},
      {name:'Perl', value:'Perl', checked:false},{name:'Ruby', value:'Ruby', checked:false},
      {name:'Assembly language', value:'Assembly language', checked:false},{name:'R', value:'R', checked:false},
      {name:'Visual Basic', value:'Visual Basic', checked:false},{name:'Objective-C', value:'Objective-C', checked:false},
      {name:'Go', value:'Go', checked:false},{name:'MATLAB', value:'MATLAB', checked:false},
      {name:'PL/SQL', value:'PL/SQL', checked:false},{name:'Scratch', value:'Scratch', checked:false},
      {name:'Solidity', value:'Solidity', checked:false},{name:'Serpent', value:'Serpent', checked:false},
      {name:'LLL', value:'LLL', checked:false},{name:'Nodejs', value:'Nodejs', checked:false},
      {name:'Scala', value:'Scala', checked:false},{name:'Rust', value:'Rust', checked:false},
      {name:'Kotlin', value:'Kotlin', checked:false},{name:'Haskell', value:'Haskell', checked:false},

    ]
    
  ngOnInit() 
  {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if(!this.currentUser)
      {
          this.router.navigate(['/login']);
      }
      if(this.currentUser && this.currentUser.type == 'company')
      {
           this.authenticationService.getCurrentCompany(this.currentUser._id)
            .subscribe(
                data => 
                {
                  console.log(data); 
                  if(!data.company_declare && !data.company_pay  && !data.company_found && !data.only_summary)
                  {
                      this.router.navigate(['/company_wizard']);
                  }
                    
                  else if(!data.company_founded && !data.no_of_employees && !data.company_funded && !data.company_description )
                  {
                      this.router.navigate(['/about_comp']);
                  }
                  else
                  {
                      this.first_name=data.first_name;
                      this.last_name=data.last_name;
                      this.company_name=data.company_name;
                      this.job_title=data.job_title;
                      this.company_website=data.company_website;
                      this.company_phone =data.company_phone;
                      this.company_country =data.company_country;
                      this.company_city=data.company_city;
                      this.company_postcode=data.company_postcode;
                      this.company_description=data.company_description;
                      this.company_founded =data.company_founded;
                      this.company_funded=data.company_funded;
                      this.no_of_employees=data.no_of_employees;
                  
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
      
  search(searchForm: NgForm)
      {
          
          console.log(searchForm.value);
          
          }
      
      onlanguageChange(e)
      {
          console.log(e.value);
          }

}
