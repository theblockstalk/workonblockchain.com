import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import {UserService} from '../../../../user.service' ;

@Component({
  selector: 'app-u-admin-talent-edit',
  templateUrl: './admin-talent-edit.component.html',
  styleUrls: ['./admin-talent-edit.component.css']
})
export class AdminTalentEditComponent implements OnInit {
  admin;
  currentUser;
  user_id;
  userDoc;
  constructor(private route: ActivatedRoute, private authenticationService: UserService) {
    this.route.params.subscribe(params => {
      this.user_id = params['user_id'];
    });
  }

  ngOnInit() {
    this.admin = JSON.parse(localStorage.getItem('admin_log'));
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(this.admin && this.currentUser) {
      this.authenticationService.getCandidateProfileById(this.user_id , true)
        .subscribe(data =>
          {
            if(data) {
              console.log("user doc");
              console.log(this.user_id);
              this.userDoc = data;
            }

          },
          error =>
          {
          });
    }

  }

}
