import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import { HttpClient } from '@angular/common/http';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
	hash;log;password;;
	constructor(private route: ActivatedRoute, private http: HttpClient,
        private router: Router,
        private authenticationService: UserService) {
        	this.hash = route.snapshot.params['hash'];
        	console.log(this.hash);

         }

  ngOnInit() {

  }

   	reset_password(f: NgForm) 
    {
    	 this.authenticationService.reset_password(this.hash,f.value)
            .subscribe(
                data => {
                if(data)
                {
                    this.router.navigate(['/login']);
                }

                if(data.error)
                {
                	this.log = data.error;
                }

               
                },
                error => {
                  //this.log = 'Something getting wrong';
                   
                });
    }

}
