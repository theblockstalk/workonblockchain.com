import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import {NgForm} from '@angular/forms';
import { AuthService } from "angular4-social-login";
import { SocialUser } from "angular4-social-login";
import { Title, Meta } from '@angular/platform-browser';

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
        private authenticationService: UserService,private authService: AuthService,private titleService: Title,private newMeta: Meta) { 
		this.titleService.setTitle('Work on Blockchain | A recruitment hiring platform for blockchain developers');
	}

  ngOnInit() 
  {
	this.newMeta.updateTag({ name: 'description', content: 'Global blockchain agnostic recruitment hiring platform for blockchain developers, software developers, designers, product managers, CTOs, researchers and software engineer interns who are passionate about public and enterprise blockchain technology and cryptocurrencies. On workonblockchain.com, companies apply to active candidates looking for jobs.' });
	this.newMeta.updateTag({ name: 'keywords', content: 'blockchain developers work recruitment jobs' });
	
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
        //console.log(user);
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

  
}
