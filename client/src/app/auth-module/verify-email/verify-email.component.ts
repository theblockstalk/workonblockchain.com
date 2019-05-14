import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
import { DataService } from '../../data.service';
import { LOCAL_STORAGE, WINDOW } from '@ng-toolkit/universal';

@Component ({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
	currentUser: User; hash;
  navigationExtras: NavigationExtras;
  constructor(@Inject(WINDOW) private window: Window, @Inject(LOCAL_STORAGE) private localStorage: any,  private route: ActivatedRoute,
        private router: Router,
        private authenticationService: UserService,private dataservice: DataService)
        {

             this.route.queryParams.subscribe(params =>
             {
                 this.hash = params['email_hash'];
            });
         }

    errorMsg;
    succesMsg;
    count=0;
  ngOnInit()
  {
        this.errorMsg='';
        this.succesMsg='';
        this.count=0;
  		this.currentUser = JSON.parse(this.localStorage.getItem('currentUser'));
  			this.authenticationService.verify_email(this.hash)
            .subscribe(
                data =>
                {
                     if (data['success'] === true && data['msg']) {
                       if (!this.currentUser) {
                         this.succesMsg = 'Email verified. Please login to continue.';
                         this.window.location.href = '/login';

                       }

                       else if (this.currentUser.type == "candidate") {
                         this.succesMsg = data['msg'];
                         this.window.location.href = '/candidate_profile';
                       }

                       else if (this.currentUser.type == "company") {
                         this.succesMsg = data['msg'];
                         this.window.location.href = '/company_profile';
                       }
                       // return data;
                     }
                },
                error =>
                {
                  if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false)
                  {
                    this.errorMsg = error['error']['message'];
                  }
                  else if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false)
                  {
                    this.errorMsg = error['error']['message'];
                  }
                  else {
                    this.errorMsg  = "Something went wrong";
                  }

                });


  	}

}
