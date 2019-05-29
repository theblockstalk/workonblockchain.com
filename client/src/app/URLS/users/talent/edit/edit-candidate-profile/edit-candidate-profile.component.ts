import { Component, OnInit } from '@angular/core';
declare var $:any;
import {UserService} from '../../../../../user.service' ;

@Component({
  selector: 'app-edit-candidate-profile',
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
              console.log("user doc");
              console.log(this.userDoc);
              this.userDoc = data;
            }

          },
          error =>
          {
          });
    }
  }


}
