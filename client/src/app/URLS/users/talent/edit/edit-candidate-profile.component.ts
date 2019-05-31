import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../../user.service' ;

@Component({
  selector: 'app-u-users-talent-edit',
  templateUrl: './edit-candidate-profile.component.html',
  styleUrls: ['./edit-candidate-profile.component.css']
})
export class EditCandidateProfileComponent implements OnInit {
  currentUser;
  userDoc;
  constructor(private authenticationService: UserService) {}

  ngOnInit()
  {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(this.currentUser && this.currentUser.type === 'candidate')
    {
      this.authenticationService.getCandidateProfileById(this.currentUser._id, false)
        .subscribe(data =>
          {
            if(data) {
              this.userDoc = data;
            }

          },
          error =>
          {
          });
    }
  }


}
