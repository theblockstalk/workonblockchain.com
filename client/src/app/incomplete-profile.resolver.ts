import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../environments/environment';
import { map } from 'rxjs/operators';
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
        }).pipe(map(
          (res) => {
            if (res) {
              console.log("response");
              console.log(res);
              if (!res['terms_id'] || res['terms_id'] === false) {
                this.router.navigate(['/terms-and-condition']);

              }
              else if (!res['contact_number'] || !res['nationality'] || !res['first_name'] || !res['last_name']) {
                this.router.navigate(['/about']);
              }
              else if(!res['candidate'].employee && !res['candidate'].contractor && !res['candidate'].volunteer) {
                this.router.navigate(['/job']);
              }
              else if (!res['why_work'] && !res['candidate'].interest_areas) {
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
          }));

      }
      if(this.currentUser.type === 'company')
      {

      }
    }
  }
}
