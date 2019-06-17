import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../environments/environment';
import { map } from 'rxjs/operators';
const URL = environment.backend_url;
import {UserService} from './user.service';


@Injectable()
export class ProfileResolver  {
  currentUser;
  constructor(private http: HttpClient, private router: Router, private authenticationService : UserService) {}

  resolve() : void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (this.currentUser)
    {
      if(this.currentUser.type === 'candidate') {
        this.authenticationService.getCandidateProfileById(this.currentUser._id, false)
          .subscribe(data => {
              if (data) {
                if (!data['candidate'].terms_id) {
                  this.router.navigate(['/terms-and-condition']);
                  return false;
                }
                else if (!data['contact_number'] || !data['nationality'] || !data['first_name'] || !data['last_name']) {
                  this.router.navigate(['/about']);
                  return false;
                }
                else if(!data['candidate'].employee && !data['candidate'].contractor && !data['candidate'].volunteer) {
                  this.router.navigate(['/work']);
                  return false;
                }
                else if (!data['candidate'].why_work && !data['candidate'].interest_areas) {
                  this.router.navigate(['/resume']);
                  return false;
                }
                else if (!data['candidate'].description) {
                  this.router.navigate(['/experience']);
                  return false;
                }
                else {
                  return true;
                }
              }

            },
            error => {
              if (error.message === 500 || error.message === 401) {
                localStorage.setItem('jwt_not_found', 'Jwt token not found');
                localStorage.removeItem('currentUser');
                localStorage.removeItem('googleUser');
                localStorage.removeItem('close_notify');
                localStorage.removeItem('linkedinUser');
                localStorage.removeItem('admin_log');
                window.location.href = '/login';
              }

              if (error.message === 403) {
                this.router.navigate(['/not_found']);
              }
            });
      }

      if(this.currentUser.type === 'company')
      {

      }
    }
  }
}
