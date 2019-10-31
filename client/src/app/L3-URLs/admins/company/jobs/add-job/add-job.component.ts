import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../../../../user.service';

@Component({
  selector: 'app-u-admin-company-jobs-add-job',
  templateUrl: './add-job.component.html',
  styleUrls: ['./add-job.component.css']
})
export class AddJobComponent implements OnInit {
  company_id;currentUser;admin_log;error;
  companyDoc;

  constructor(private route: ActivatedRoute,private authenticationService: UserService,private router: Router) {
    this.route.params.subscribe(params => {
      this.company_id = params['company_id'];
    });
  }

  ngOnInit() {
    console.log('in admin jobs add UURL');
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.admin_log = JSON.parse(localStorage.getItem('admin_log'));

    if(this.currentUser) {
      if (this.company_id && this.admin_log.is_admin === 1 && this.currentUser) {
        this.authenticationService.getCurrentCompany(this.company_id, true)
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
