import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../../../user.service';

@Component({
  selector: 'app-u-admin-company-company-view',
  templateUrl: './company-view.component.html',
  styleUrls: ['./company-view.component.css']
})
export class CompanyViewComponent implements OnInit {
  user_id;currentUser;admin_log;error;
  companyDoc;

  constructor(private route: ActivatedRoute,private authenticationService: UserService,private router: Router) {
    this.route.params.subscribe(params => {
      this.user_id = params['user_id'];
    });
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.admin_log = JSON.parse(localStorage.getItem('admin_log'));

    if(this.currentUser) {
      if (this.user_id && this.admin_log.is_admin === 1 && this.currentUser) {
        this.authenticationService.getCurrentCompany(this.user_id, true)
          .subscribe(
            data => {
              this.companyDoc = data;
            },
            error => {
              if (error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
                this.error = error['error']['message'];
              }
              else if (error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
                this.error = error['error']['message'];
              }
              else this.error = "Something went wrong";
            });
      }
      else this.router.navigate(['/not-found']);
    }
    else this.router.navigate(['/login']);
  }

}
