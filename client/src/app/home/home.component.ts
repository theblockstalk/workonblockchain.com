import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import {NgForm} from '@angular/forms';
import { AuthService } from "angular4-social-login";
import { SocialUser } from "angular4-social-login";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	currentUser: User; 
  log;log1;
  private user: SocialUser;data;result;
  constructor( private route: ActivatedRoute,
        private router: Router,
        private authenticationService: UserService,private authService: AuthService) { }

  ngOnInit() 
  {
	/*this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
   	if(!this.currentUser)
    {
          this.router.navigate(['/login']);
    }
    this.authenticationService.getById(this.currentUser._id).subscribe(data => 
    {
      this.authService.authState.subscribe((user) => 
      {
       
        this.user = user; 
        console.log(user);
        this.data = JSON.stringify(this.user);      
        this.result = JSON.parse(this.data);
      
      });
      /*console.log(data);
      if(!data.contact_number && !data.nationality)
      {
          this.router.navigate(['/about']);
      }
       else if(!data.country || !data.roles || !data.interest_area || !data.expected_salary || !data.availability_day || !data.availability_year)
      {
          this.router.navigate(['/job']);
      }
      else if(!data.commercial_platform || !data.experimented_platform || !data.why_work || !data.platforms)
      {
          this.router.navigate(['/resume']);
      }
     
      else if(!data.history || !data.education || !data.experience_roles || !data.current_salary || !data.work_experience_year)
      {
        this.router.navigate(['/experience']);
      }

      else if(!data.description )
      {
        this.router.navigate(['/final']);
      }*/
      


    //});

  }

   Search(searchForm: NgForm) 
   {
    console.log(searchForm.value);
     this.authenticationService.search(searchForm.value)
            .subscribe(
                data => {
                if(data)
                {
                    //console.log(data[0].country);
                     console.log(data);
                    this.log =data;
                    //this.log1 =data.nationality;
                }

                if(data.error )
                {
                    console.log(data.error);
                }
               
                },
                error => {
                  //this.log = 'Something getting wrong';
                   
                });
   }
}
