import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute,NavigationExtras } from '@angular/router';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import { HttpClient } from '@angular/common/http';
import {NgForm} from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataService } from "../data.service";


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
	message;log;data:any;
    email;

  constructor(private route: ActivatedRoute, private http: HttpClient,
        private router: Router,
        private authenticationService: UserService,private dataservice: DataService) {
        	
         }

  ngOnInit() {
   
  }
   
   	forgot_password(f: NgForm) 
    {
    	

            this.authenticationService.forgot_password(f.value.email)
            .subscribe(
                data => {      
                	//console.log(data);
                	if(!data['error'])
                	{
                		this.dataservice.forgertMessage("Please check your email to reset the password.");
        				this.router.navigate(["/login"]);
                    	
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

}
