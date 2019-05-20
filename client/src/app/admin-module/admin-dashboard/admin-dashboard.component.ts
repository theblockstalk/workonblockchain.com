import { Component, OnInit } from '@angular/core';
import {UserService} from '../../user.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  currentUser: any;
  is_admin;
  user_type;
  admin_log;
  constructor(private router: Router,private authenticationService: UserService) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.admin_log = JSON.parse(localStorage.getItem('admin_log'));

    if(!this.currentUser)
    {
      this.router.navigate(['/login']);
    }

    if(this.currentUser && this.admin_log )
    {
      if(this.admin_log.is_admin === 1) {

      }
      else
        this.router.navigate(['/not_found']);
    }
    else
    {
      this.router.navigate(['/not_found']);
    }
  }

}
