import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {UserService} from '../../../user.service';

@Component({
  selector: 'app-u-pricing-plan',
  templateUrl: './pricing-plan.component.html',
  styleUrls: ['./pricing-plan.component.css']
})
export class PricingPlanComponent implements OnInit {
  viewBy;pricingDoc;currentUser;

  constructor(private authenticationService: UserService, private router: Router) { }

  ngOnInit() {
    this.viewBy = 'company';
    console.log('in pricing page URL for comp wizard');
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(!this.currentUser) {
      this.router.navigate(['/login']);
    }
    else if(this.currentUser && this.currentUser.type === 'company') {
      this.authenticationService.getCurrentCompany(this.currentUser._id, false)
      .subscribe(
        data => {
          console.log(data);
          this.pricingDoc = data;
        },
        error => {
          if(error['message'] === 500 || error['message'] === 401) {
            localStorage.setItem('jwt_not_found', 'Jwt token not found');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('googleUser');
            localStorage.removeItem('close_notify');
            localStorage.removeItem('linkedinUser');
            localStorage.removeItem('admin_log');
            window.location.href = '/login';
          }
          if(error['message'] === 403) this.router.navigate(['/not_found']);
        }
      );
    }
  }

}
