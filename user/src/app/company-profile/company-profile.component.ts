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
  constructor( private route: ActivatedRoute,
        private router: Router,
        private authenticationService: UserService) { }


  ngOnInit() 
  {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if(!this.currentUser)
      {
          this.router.navigate(['/login']);
      }
      else
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
                  
                },
                error => 
                {
                  
                });
      }
  }

}
