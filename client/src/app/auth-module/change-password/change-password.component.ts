import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
import {NgForm , FormsModule} from '@angular/forms';
import { DataService } from '../../data.service';
import { LOCAL_STORAGE, WINDOW } from '@ng-toolkit/universal';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  currentUser: User;
  credentials: any = {};
  confirm_password;
  id;
  log;
  buttonSubmit;

  constructor(@Inject(WINDOW) private window: Window, @Inject(LOCAL_STORAGE) private localStorage: any,  private route: ActivatedRoute,
               private router: Router,
               private authenticationService: UserService,private dataservice: DataService) { }

  ngOnInit() {
    this.currentUser = JSON.parse(this.localStorage.getItem('currentUser'));
    if(this.currentUser)
    {
      this.id= this.currentUser._id;
    }
    else
    {
      this.router.navigate(['/not_found']);

    }
  }

  new_log;current_log;
  change_password(formdata: NgForm)
  {

    this.buttonSubmit = 'submit';
    if(!this.credentials.current_password)
    {

      this.new_log="Please enter current password";
    }

    if(!this.credentials.password)
    {

      this.current_log="Please enter new password";
    }


    if(this.credentials.password != this.credentials.confirm_password)
    {
      this.confirm_password ="Password doesn't matched";

    }

    if(formdata.valid === true && this.credentials.password && this.credentials.current_password && this.credentials.password == this.credentials.confirm_password)
    {
      this.confirm_password='';

      this.authenticationService.change_password(this.credentials)
        .subscribe(
          data =>
          {
              this.log='';

              this.localStorage.setItem('password_change_msg', JSON.stringify("Your password has been successfully changed. Please log back in to continue!"));

              this.localStorage.removeItem('currentUser');
              this.localStorage.removeItem('googleUser');
              this.localStorage.removeItem('linkedinUser');
              this.localStorage.removeItem('admin_log');
              this.window.location.href = '/login';



          },
          error=>
          {
            if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false)
            {
              this.log = error['error']['message'];
            }
            else if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false)
            {
              this.log = error['error']['message'];
            }
            else {
              this.log = "Something went wrong";
            }

          });

    }

  }

}
