import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import {UserService} from '../../../../../user.service' ;

@Component({
  selector: 'app-u-users-companies-jobs-company-add-job',
  templateUrl: './company-add-job.component.html',
  styleUrls: ['./company-add-job.component.css']
})
export class CompanyAddJobComponent implements OnInit {
  currentUser;userDoc;

  constructor(private authenticationService: UserService,private router: Router) { }

  ngOnInit() {
    console.log('in company add job');
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(!this.currentUser) this.router.navigate(['/login']);
    if(this.currentUser && this.currentUser.type === 'company'){
      this.authenticationService.getCurrentCompany(this.currentUser._id, false)
        .subscribe(
          data =>{
            this.userDoc = data;
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
