import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../environments/environment';
import { Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { LOCAL_STORAGE, WINDOW } from '@ng-toolkit/universal';

const URL = environment.backend_url;

@Injectable()
export class LoginResolver  {
  currentUser;
  constructor(@Inject(WINDOW) private window: Window, @Inject(LOCAL_STORAGE) private localStorage: any,  private http: HttpClient, private router: Router) {}

  resolve() : void {
    if(this.localStorage.getItem('currentUser')) {
      this.currentUser = JSON.parse(this.localStorage.getItem('currentUser'));
      if (this.currentUser) {
        if (this.currentUser.type === 'candidate')
          this.router.navigate(['/candidate_profile']);
        if (this.currentUser.type === 'company') {
          console.log("company");
          if (new Date(this.currentUser.created_date) < new Date('2018/11/28')) {
            this.http.get(URL + 'users/current_company/' + this.currentUser._id, {
              headers: new HttpHeaders().set('Authorization', this.currentUser.jwt_token)
            }).pipe(map(res => {
              if (res && !res['saved_searches']) {
                this.window.location.href = '/company_profile';
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
}
