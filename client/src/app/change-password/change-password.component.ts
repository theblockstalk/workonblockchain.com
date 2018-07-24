import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import {NgForm,FormsModule} from '@angular/forms';
import { DataService } from "../data.service";

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
    pass_log;


   constructor( private route: ActivatedRoute,
        private router: Router,
        private authenticationService: UserService,private dataservice: DataService) { }

  ngOnInit() {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if(this.currentUser)
      {
          this.id= this.currentUser._creator;
      }
      else
      {
           this.router.navigate(['/not_found']);
          
     }
  }
    
    
    change_password(formdata: NgForm)
    {
        console.log(formdata.value);
        console.log(this.credentials.password);
        console.log(this.credentials.confirm_password);
        
        if(this.credentials.password != this.credentials.confirm_password)
        {
            console.log("if");
            this.confirm_password ="Password doesn't matched";
            
       }
       
       else
       {
            this.confirm_password='';
            console.log("else");
            
            this.authenticationService.change_password(this.id ,  this.credentials)
            .subscribe(
                data => 
                {
                    if(data.error)
                    {
                     this.log = data.error;
                     }
                    else
                        {
                         this.log='';
                         this.dataservice.changeMessage("Password Changed successfully");
                            console.log(data);
                            localStorage.removeItem('currentUser');
                            localStorage.removeItem('googleUser');
                            localStorage.removeItem('linkedinUser');
                            localStorage.removeItem('admin_log');
                        //this.router.navigate(['/login']);
                           window.location.href = '/login';
                        }
                    
                    
                });
            
       }
        
    }

}
