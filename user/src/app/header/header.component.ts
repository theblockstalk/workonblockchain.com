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
  

  constructor(private authenticationService: UserService) {
  this.currentUser = JSON.parse(localStorage.getItem('currentUser'));    
  }

  ngOnInit() {
      
  }
    
    logout()
    {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('googleUser');
     }

}
