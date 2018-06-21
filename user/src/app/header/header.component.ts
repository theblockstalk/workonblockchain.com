import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import {User} from '../Model/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  currentUser: User;
  user_type;
  

  constructor(private authenticationService: UserService) 
  {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')); 
      if(this.currentUser)
      {
           this.user_type = this.currentUser.type;
          console.log(this.user_type);
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
