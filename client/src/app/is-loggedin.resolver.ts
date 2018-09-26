import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';

@Injectable()
export class LoginResolver  {
  currentUser;
  constructor( private router: Router) {}
  
  resolve() : void {
     this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
     if (this.currentUser) 
     {
         if(this.currentUser.type === 'candidate')
             this.router.navigate(['/candidate_profile']);
         if(this.currentUser.type === 'company')
             this.router.navigate(['/candidate-search']);
     }
  }
}