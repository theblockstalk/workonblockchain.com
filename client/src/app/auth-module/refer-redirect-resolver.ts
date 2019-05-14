import { Injectable, Inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve, Router } from '@angular/router';
import {environment} from '../../environments/environment';
import { WINDOW } from '@ng-toolkit/universal';
const URL = environment.frontend_url;

@Injectable({
  providedIn: 'root'
})
export class ReferRedirectResolver implements Resolve<any> {
  currentUser;
  redirectUrl = URL.replace(/\/$/, "") + '?code=';

  constructor(@Inject(WINDOW) private window: Window,  private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, rstate: RouterStateSnapshot): void {
    const pathName = this.window.location.pathname;
    const inputParameter = this.window.location.search;
    const referCode =  this.window.location.search.split('code=')[1];

    if(pathName === '/refer' && inputParameter.match(/code=/i)){
      this.router.navigate([''], { queryParams: { code: referCode } });
    }
    else {
      this.router.navigate(['/not_found']);

    }
  }
}
