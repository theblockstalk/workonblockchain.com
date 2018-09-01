import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import {NgForm} from '@angular/forms';
import { AuthService } from "angular4-social-login";
import { SocialUser } from "angular4-social-login";

@Component({
  selector: 'app-final',
  templateUrl: './final.component.html',
  styleUrls: ['./final.component.css']
})
export class FinalComponent implements OnInit {
  
  currentUser: User; 
  log;log1;
  private user: SocialUser;data;result;

   constructor( private route: ActivatedRoute,
        private router: Router,
        private authenticationService: UserService,private authService: AuthService) { }

  ngOnInit() 
  {
     
  }

  final(finalForm: NgForm)
  {
    
  }



}
