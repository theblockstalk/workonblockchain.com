import { Component, OnInit, Inject } from '@angular/core';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
import { Router, ActivatedRoute } from '@angular/router';
import { LOCAL_STORAGE, WINDOW } from '@ng-toolkit/universal';


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

    currentUser: any;
    is_admin;
    user_type;
  constructor(@Inject(WINDOW) private window: Window, @Inject(LOCAL_STORAGE) private localStorage: any, private router: Router,private authenticationService: UserService) { }

  ngOnInit() {

    this.currentUser = JSON.parse(this.localStorage.getItem('currentUser'));
      if(this.currentUser )
      {
          this.user_type = this.currentUser.type;
          if(this.user_type === 'candidate')
          {
           this.authenticationService.getById(this.currentUser._id)
            .subscribe(
                data =>
                {
                    if(data)
                    {
                         this.is_admin = data['is_admin'];
                        if(this.is_admin == 1)
                        {
                            this.localStorage.setItem('admin_log', JSON.stringify(data));
                        }
                        else
                        {
                            this.localStorage.removeItem('admin_log');
                            this.router.navigate(['/not_found']);
                        }
                    }

                },
                error=>
                {
                    if(error.message === 500 || error.message === 401)
                        {
                            this.localStorage.setItem('jwt_not_found', 'Jwt token not found');
                            this.localStorage.removeItem('currentUser');
                                    this.localStorage.removeItem('googleUser');
                                    this.localStorage.removeItem('close_notify');
                                    this.localStorage.removeItem('linkedinUser');
                                    this.localStorage.removeItem('admin_log');
                            this.window.location.href = '/login';
                        }

                        if(error.message === 403)
                        {
                            // this.router.navigate(['/not_found']);
                        }
                }
                );
         }
         else if(this.user_type === 'company'  )
         {
              this.authenticationService.getCurrentCompany(this.currentUser._id)
            .subscribe(
                data =>
                {
                    if(data)
                    {
                        //this.is_verify = data[0]._creator.is_verify;
                         this.is_admin = data['_creator'].is_admin;
                        if(this.is_admin == 1)
                        {
                            this.localStorage.setItem('admin_log', JSON.stringify(data['_creator']));
                        }
                        else
                        {
                            this.localStorage.removeItem('admin_log');
                            this.router.navigate(['/not_found']);
                        }
                        //localStorage.setItem('admin_log', JSON.stringify(data[0]._creator));
                    }

                });
         }
          else
          {
              this.localStorage.removeItem('admin_log');
                this.router.navigate(['/not_found']);
          }
           //this.is_admin = this.currentUser.is_admin;

      }
      else
       {
          this.localStorage.removeItem('admin_log');
           this.router.navigate(['/not_found']);
       }
  }

}
