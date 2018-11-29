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
         {
           if (new Date(this.currentUser.created_date) < new Date('2018/11/28')) {
             this.http.get<any>(URL+'users/current_company/' +this.currentUser._id, {
               headers: new HttpHeaders().set('Authorization', this.currentUser.jwt_token)
             }).map((res) => res).subscribe(
               (res) => {
                 if (!res.saved_searches) {
                   window.location.href = '/company_profile';
                 }
                 else {
                   this.router.navigate(['/candidate-search']);

                 }
               });
           }
           else {
             this.router.navigate(['/candidate-search']);
           }

         }
     }
  }
}
