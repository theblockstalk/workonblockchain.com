import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  currentUser: User;
  user_type;is_admin;
  route;

  constructor(private authenticationService: UserService,private router: Router,location: Location) 
  {
      router.events.subscribe((val) => {
      if(location.path() != ''){
        this.route = location.path();
          console.log(this.route);
      } else {
        //this.route = 'Home'
      }
    });
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')); 
      console.log(this.currentUser);
      if(this.currentUser)
      {
           this.user_type = this.currentUser.type;
           this.is_admin = this.currentUser.is_admin;
           console.log(this.user_type);
           console.log(this.is_admin);
      }
      else
      {
          this.currentUser=null;
           this.user_type='';
          
      }
      
   
      
  }

  ngOnInit() {
      
  }
    
    logout()
    {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('googleUser');
     }

}
