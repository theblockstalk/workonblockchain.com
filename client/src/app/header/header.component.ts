import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DatePipe } from '@angular/common';
import { DataService } from "../data.service";


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
  date;
  msg;
  increment;
  user_name = 'Admin';
  setting;
  log;success;
    success_msg;

  constructor(private authenticationService: UserService,private dataservice: DataService,private router: Router,location: Location,private datePipe: DatePipe) 
  {
      this.success_msg='';
      router.events.subscribe((val) => {
      if(location.path() != ''){
        this.route = location.path();
          ////console.log(this.route);
          let loc= this.route;
             // //console.log(this.loc);
         let x = loc.split("-");
          this.admin_route = x[0];

      } else {
        //this.route = 'Home'
      }
    });
     
              
     //this.date = this.datePipe.transform(this.today + 30*60000, 'h:MM:ss');
          //this.date = new Date(new Date().getTime() +  1800 *1000);
          
   ////console.log(this.admin_route);

    this.currentUser = JSON.parse(localStorage.getItem('currentUser')); 
     // //console.log(this.currentUser);
     
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
                        this.is_verify = data._creator.is_verify;
						this.is_admin = data._creator.is_admin;
                        this.user_name = data.first_name+' '+data.last_name;
						if(this.is_admin === 1)
                        {
                          //this.admin_route = '/admin';   
                        }
                        else
                        { 
                            this.admin_route = '';
                        }
                    }
                });
         }
         else if(this.user_type === 'company')
         {
              //console.log("else if");
              this.authenticationService.getCurrentCompany(this.currentUser._creator)
            .subscribe(
                data => 
                {
                    //console.log(data);
                    if(data)
                    {
                        this.is_verify = data[0]._creator.is_verify;
                        this.is_admin = data[0]._creator.is_admin;
						this.user_name = data[0].first_name+' '+data[0].last_name;
                        if(this.is_admin === 1)
                        {
                          //this.admin_route = '/admin';   
                        }
                        else
                        { 
                            this.admin_route = '';
                        }
                    }
                });
		 }
        }
      else
      {
          this.currentUser=null;
           this.user_type='';
          
      }   
      
  }

 
  ngOnInit() 
  {
      this.success='';
      this.success_msg = '';
      this.msg='';
      if(this.currentUser)
      {
          this.dataservice.currentMessage.subscribe(message => this.msg = message);
          setInterval(() => {  
                                this.msg = "" ;
                        }, 3000);
          this.close = JSON.parse(localStorage.getItem('close_notify')); 
       }
  }
  
  
  verify_client()
  {
      this.success_msg='';
      this.msg='';
      this.close = "no close"; 
      //localStorage.setItem('close_notify', JSON.stringify(this.close));
      if(this.currentUser.email)
      {
          console.log(this.currentUser.email);
           this.authenticationService.verify_client(this.currentUser.email)
            .subscribe(
                data => {      
                    console.log(data);
                    if(data['msg'])
                    {
                        
                        this.success_msg = "Please check your email to verify your account" ;
                        
                        setInterval(() => {  
                                this.success_msg = "" ;
                                this.close = "";
                        }, 9000);
                        
                    }

                    else
                    {
                        this.dataservice.changeMessage(data['error']);
                        this.log= data['error'];
                        
                        
                    }
               
                },
                error => {
                 this.dataservice.changeMessage(error);
                   
                });
          
      }
      else
      {
          
      }
  }
    close;
    close_notify()
    {
        this.success_msg='';
        this.close = "close"; 
        localStorage.setItem('close_notify', JSON.stringify(this.close)); 
         
    }
    
    logout()
    {
        
        
         this.authenticationService.destroyToken(this.currentUser._id)
            .subscribe(
                data => {      
                console.log(data);
                    if(data)
                    {
                        
                    }
                    
                    },
                error =>
                {
                    if(error.message == 500 || error.message == 401)
                    {
                        localStorage.setItem('jwt_not_found', 'Jwt token not found');
                        window.location.href = '/login';
                    }
                    
                    });
        
					localStorage.removeItem('currentUser');
					localStorage.removeItem('googleUser');
					localStorage.removeItem('close_notify');
					localStorage.removeItem('linkedinUser');
					localStorage.removeItem('admin_log');
       
    }
    

}
