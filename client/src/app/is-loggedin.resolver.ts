import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../environments/environment';
import { Observable} from 'rxjs';
import { map } from 'rxjs/operators';

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
             this.http.get(URL+'users/current_company/' +this.currentUser._id, {
               headers: new HttpHeaders().set('Authorization', this.currentUser.jwt_token)
             }).pipe(map(res =>
             {
                 if (res && !res['saved_searches'] ) {
                   window.location.href = '/company_profile';
                 }
                 else {
                   this.router.navigate(['/candidate-search']);

                 }
               }));
           }
           else {
             this.router.navigate(['/candidate-search']);
           }

         }
     }
  }
}
