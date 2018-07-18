import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  is_cookie;
  display_cookie = 0;
  constructor(private cookieService: CookieService) { }

  ngOnInit() {
	  this.is_cookie = this.cookieService.check('wob_cookie');
	  console.log(this.is_cookie);
	  if(this.is_cookie){
		  this.display_cookie = 1;
	  }
  }
  
  accept_cookie(){
	   console.log('set cookie here');
	   this.cookieService.set('wob_cookie','Setting WOB cookie for 30 days',108000);
	   console.log('cookie has been set');
   }

}
