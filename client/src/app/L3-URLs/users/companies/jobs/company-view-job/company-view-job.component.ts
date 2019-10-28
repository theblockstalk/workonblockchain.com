import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../../../../user.service';

@Component({
  selector: 'app-u-users-companies-jobs-company-view-job',
  templateUrl: './company-view-job.component.html',
  styleUrls: ['./company-view-job.component.css']
})
export class CompanyViewJobComponent implements OnInit {
  job_id;currentUser;jobDoc;

  constructor(private route: ActivatedRoute,private authenticationService: UserService,private router: Router) {
    this.route.params.subscribe(params => {
      this.job_id = params['job_id'];
    });
  }

  ngOnInit() {
    console.log('comp job view URL');
    console.log(this.job_id);
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(!this.currentUser) this.router.navigate(['/login']);
    if(this.currentUser && this.currentUser.type === 'company'){
      this.authenticationService.getAJob(this.job_id, this.currentUser['_id'], false)
        .subscribe(
          data =>{
            this.jobDoc = data;
            console.log(this.jobDoc);
          },
          error => {
            if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false)
              console.log(error['error']['message']);
          }
        );
    }
    else this.router.navigate(['/not_found']);
  }

}
