import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
import { DataService } from '../../data.service';

@Component ({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
	currentUser: User; hash;
  navigationExtras: NavigationExtras;
  constructor( private route: ActivatedRoute,
        private router: Router,
        private authenticationService: UserService,private dataservice: DataService)
        {
          /*this.hash = route.snapshot.params['email_hash'];
          ////console.log(this.hash);*/
             this.route.queryParams.subscribe(params =>
             {
                 this.hash = params['email_hash'];
                 ////console.log(this.hash); // Print the parameter to the console.
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
  		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      //////console.log(this.currentUser);
  			this.authenticationService.verify_email(this.hash)
            .subscribe(
                data =>
                {
                  console.log(data);
                     if (data['success'] === true && data['msg'])
                    {
                        if(!this.currentUser)
                        {
                            this.succesMsg= 'Email verified. Please login to continue.';

                            //window.location.href = '/login';

                        }

                        else if(this.currentUser.type=="candidate")
                        {
                            this.succesMsg = data['msg'];
                            window.location.href = '/candidate_profile';
                        }

                        else if(this.currentUser.type=="company")
                        {
                            this.succesMsg = data['msg'];
                            window.location.href = '/company_profile';
                        }
                   // return data;
                }
                if(data['success'] === false && data['error'])
                {
                    if(!this.currentUser)
                        {
                            this.errorMsg = data['error'];

                        }

                        else if(this.currentUser.type=="candidate")
                        {
                            this.errorMsg = data['error'];

                        }

                        else if(this.currentUser.type=="company")
                        {
                            this.errorMsg = data['error'];

                        }
                }

                },
                error =>
                {
                    if(error.error.message === 'jwt expired')
                    {
                      this.errorMsg = error.error.message;

                    }

                });


  	}

}
