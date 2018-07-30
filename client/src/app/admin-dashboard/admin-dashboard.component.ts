import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

    currentUser: User;
    is_admin;
    user_type;
  constructor(private router: Router,private authenticationService: UserService) { }

  ngOnInit() {
        
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')); 
      //console.log(this.currentUser);
      if(this.currentUser )
      {
          this.user_type = this.currentUser.type;
          if(this.user_type === 'candidate')
          {
          //console.log("if");
           this.authenticationService.getById(this.currentUser._id)
            .subscribe(
                data => 
                {
                    //console.log(data);
                    if(data)
                    {
                        //this.is_verify = data._creator.is_verify;
                         this.is_admin = data._creator.is_admin;
                        if(this.is_admin == 1)
                        {
                            localStorage.setItem('admin_log', JSON.stringify(data._creator));
                        }
                        else
                        {
                            localStorage.removeItem('admin_log');
                            this.router.navigate(['/not_found']);
                        }
                    }
                    
                });
         }
         else if(this.user_type === 'company'  )
         {
              //console.log("else if");
              this.authenticationService.getCurrentCompany(this.currentUser._creator)
            .subscribe(
                data => 
                {
                    //console.log(data);
                    if(data)
                    {
                        //this.is_verify = data[0]._creator.is_verify;
                         this.is_admin = data[0]._creator.is_admin;
                        if(this.is_admin == 1)
                        {
                            localStorage.setItem('admin_log', JSON.stringify(data[0]._creator));
                        }
                        else
                        {
                            localStorage.removeItem('admin_log');
                            this.router.navigate(['/not_found']);
                        }
                        //localStorage.setItem('admin_log', JSON.stringify(data[0]._creator));
                    }
                    
                });
         }
          else
          {
              localStorage.removeItem('admin_log');
                this.router.navigate(['/not_found']);
          }
           //this.is_admin = this.currentUser.is_admin;
          
      }
      else
       {
          localStorage.removeItem('admin_log');
           this.router.navigate(['/not_found']);
       }
  }

}
