import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve, Router,CanActivate  } from '@angular/router';
import {UserService} from "../user.service";
import {environment} from '../../environments/environment';
const URL = environment.frontend_url;

@Injectable({
  providedIn: 'root'
})
export class VerifyEmailMiddleware implements CanActivate {
  currentUser;

  constructor( private router: Router, private authenticationService: UserService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  canActivate(): boolean{
    if(this.currentUser) {
      if(this.currentUser.type === 'candidate') {
        this.authenticationService.getById(this.currentUser._id)
          .subscribe(
            data =>
            {
              if(data) {
                if(data['is_verify'] === 1) {
                  return true;
                }
                else {
                  this.router.navigate(['/candidate-verify-email']);
                  return false;
                }
              }
            },
            error =>
            {

            });
      }
      else if(this.currentUser.type === 'company') {
        this.authenticationService.getCurrentCompany(this.currentUser.company_id)
          .subscribe(
            data =>
            {
              if(data) {
                if (data['_creator'].is_verify === 1) {
                  return true;
                }
                else {
                  this.router.navigate(['/company-verify-email']);
                  return false;
                }
              }
            },
            error =>
            {
              if(error['message'] === 500 || error['message'] === 401)
              {
                localStorage.setItem('jwt_not_found', 'Jwt token not found');
                localStorage.removeItem('currentUser');
                localStorage.removeItem('googleUser');
                localStorage.removeItem('close_notify');
                localStorage.removeItem('linkedinUser');
                localStorage.removeItem('admin_log');
                window.location.href = '/login';
              }

              if(error['message'] === 403)
              {
                // this.router.navigate(['/not_found']);
              }
            });
      }
      else {

      }
    }

    return true;
  }
}
