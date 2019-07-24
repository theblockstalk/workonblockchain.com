import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../../user.service' ;

@Component({
  selector: 'app-u-admin-talent-view',
  templateUrl: './admin-talent-view.component.html',
  styleUrls: ['./admin-talent-view.component.css']
})
export class AdminTalentViewComponent implements OnInit {

  admin;
  currentUser;
  user_id;
  userDoc;
  constructor(private route: ActivatedRoute, private router: Router, private authenticationService: UserService) {
    this.route.params.subscribe(params => {
      this.user_id = params['user_id'];
    });
  }

  ngOnInit() {
    this.admin = JSON.parse(localStorage.getItem('admin_log'));
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (this.user_id && this.admin && this.currentUser) {
      if(this.admin.is_admin == 1) {
        this.authenticationService.getCandidateProfileById(this.user_id, true)
          .subscribe(data => {
              if (data) this.userDoc = data;
              else this.router.navigate(['/not_found']);
            },
            error => {
              this.router.navigate(['/not_found']);
            }
          );
      }
    }
    else this.router.navigate(['/not_found']);
  }

}
