import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  currentUser: User;
    is_admin;
  constructor(private router: Router) { }

  ngOnInit() {
        
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')); 
      if(this.currentUser && this.currentUser.is_admin == 1 )
      {
          // this.user_type = this.currentUser.type;
           this.is_admin = this.currentUser.is_admin;
          
      }
      else
       {
           this.router.navigate(['/not_found']);
       }
  }

}
