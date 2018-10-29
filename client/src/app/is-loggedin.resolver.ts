import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '../environments/environment';

const URL = environment.backend_url;

@Injectable()
export class LoginResolver  {
  currentUser;
  constructor( private http: HttpClient, private router: Router) {}
  
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
