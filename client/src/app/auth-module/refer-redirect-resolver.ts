import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve, Router } from '@angular/router';
import {environment} from '../../environments/environment';
const URL = environment.frontend_url;

@Injectable({
  providedIn: 'root'
})
export class ReferRedirectResolver implements Resolve<any> {
  currentUser;
  redirectUrl = URL.replace(/\/$/, "") + '?code=';

  constructor( private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, rstate: RouterStateSnapshot): void {
    const pathName = window.location.pathname;
    const inputParameter = window.location.search;
    const referCode =  window.location.search.split('code=')[1];

    if(pathName === '/refer' && inputParameter.match(/code=/i)){
      this.router.navigate([''], { queryParams: { code: referCode } });
    }
    else {
      this.router.navigate(['/not_found']);

    }
  }
}
