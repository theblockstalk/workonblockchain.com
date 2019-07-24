import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { UserService } from '../../../../../user.service' ;

@Component({
  selector: 'app-u-users-talent-view-candidate-profile',
  templateUrl: './candidate-profile.component.html',
  styleUrls: ['./candidate-profile.component.css']
})
export class CandidateProfileComponent implements OnInit {
  currentUser;
  userDoc;

  constructor(private router: Router, private authenticationService: UserService) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(this.currentUser && this.currentUser.type === 'candidate'){
      this.authenticationService.getCandidateProfileById(this.currentUser._id, false)
        .subscribe(data => {
            if (data) this.userDoc = data;
            else this.router.navigate(['/not_found']);
          },
          error => {
            this.router.navigate(['/not_found']);
          }
        );
    }
    else this.router.navigate(['/not_found']);
  }

}
