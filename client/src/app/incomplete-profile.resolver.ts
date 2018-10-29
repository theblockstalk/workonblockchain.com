import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '../environments/environment';

const URL = environment.backend_url;

@Injectable()
export class ProfileResolver  {
  currentUser;
  constructor(private http: HttpClient, private router: Router) {}

  resolve() : void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (this.currentUser)
    {
      if(this.currentUser.type === 'candidate')
      {
        this.http.get(URL + 'users/current/' + this.currentUser._creator ,  {
          headers: new HttpHeaders().set('Authorization', this.currentUser.jwt_token)
        }).map((res) => res).subscribe(
          (res) => {
            if (res) {
              if (!res['terms'] || res['terms'] === false) {
                this.router.navigate(['/terms-and-condition']);

              }
              else if (!res['contact_number'] || !res['nationality'] || !res['first_name'] || !res['last_name']) {
                this.router.navigate(['/about']);
              }
              else if (res['locations'].length < 1 || res['roles'].length < 1 || res['interest_area'].length < 1 || !res['expected_salary'] || !res['current_salary']) {
                this.router.navigate(['/job']);
              }
              else if (!res['why_work']) {
                this.router.navigate(['/resume']);
              }
              else if (!res['description']) {
                this.router.navigate(['/experience']);

              }
              else {

              }

            }
          },
            (error) =>
            {
              if(error.message === 500 || error.message === 401)
              {
                localStorage.setItem('jwt_not_found', 'Jwt token not found');
                window.location.href = '/login';
              }


              if(error.message === 403)
              {
                // this.router.navigate(['/not_found']);
              }
            })

      }
      if(this.currentUser.type === 'company')
      {

      }
    }
  }
}
