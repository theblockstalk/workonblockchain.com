import { Component, OnInit, Inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {environment} from '../../environments/environment';
import { WINDOW } from '@ng-toolkit/universal';
declare var $:any;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  is_cookie;
  display_cookie = 0;
  constructor(@Inject(WINDOW) private window: Window, private cookieService: CookieService) { }

  ngOnInit() {
    this.is_cookie = this.cookieService.check('wob_cookie');
    if(this.is_cookie){
      this.display_cookie = 1;
    }

    if(environment.frontend_url === 'https://workonblockchain.com/'){
      /// Global site tag (gtag.js) - Google Analytics ///
      document.write('<script async src="https://www.googletagmanager.com/gtag/js?id=UA-119052122-1"></script>');
      document.write('<script type="text/javascript">\twindow.dataLayer = window.dataLayer || [];\n' +
        '\tfunction gtag(){dataLayer.push(arguments);}\n' +
        '\tgtag(\'js\', new Date());\n' +
        '\tgtag(\'config\', \'UA-119052122-1\');</script>');
    }

  }

  accept_cookie(){
    this.cookieService.set('wob_cookie','Setting WOB cookie for 30 days',108000);
  }

}
