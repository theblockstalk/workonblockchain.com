import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  currentUser: User;
  user_type;is_admin;
  route;
  admin_route;
  is_verify;

  constructor(private authenticationService: UserService,private router: Router,location: Location) 
  {
      router.events.subscribe((val) => {
      if(location.path() != ''){
        this.route = location.path();
          //console.log(this.route);
          let loc= this.route;
             // console.log(this.loc);
         let x = loc.split("-");
          this.admin_route = x[0];

      } else {
        //this.route = 'Home'
      }
    });
   //console.log(this.admin_route);

    this.currentUser = JSON.parse(localStorage.getItem('currentUser')); 
     // console.log(this.currentUser);
      if(this.currentUser)
      {
           this.user_type = this.currentUser.type;
          
           this.authenticationService.getById(this.currentUser._id)
            .subscribe(
                data => 
                {
                    console.log(data._creator.is_verify);
                    if(data)
                    {
                        this.is_verify = data._creator.is_verify;
                         this.is_admin = data._creator.is_admin;
                    }
                    
                });
           
      }
      else
      {
          this.currentUser=null;
           this.user_type='';
          
      }   
      
  }

  ngOnInit() 
  {
      
  }
    
    logout()
    {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('googleUser');
     }

}
