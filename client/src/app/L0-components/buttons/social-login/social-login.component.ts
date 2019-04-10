import { Component, OnInit, Input } from '@angular/core';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-social-login',
  templateUrl: './social-login.component.html',
  styleUrls: ['./social-login.component.css']
})
export class SocialLoginComponent implements OnInit {
  @Input() socialType;
  @Input() label;
  urlLink;
  buttonClass;
  iconClass;
  constructor() { }

  ngOnInit() {
     if(this.socialType === 'google') {
      const google_id = environment.google_client_id;
      const google_redirect_url = environment.google_redirect_url;
      this.urlLink = 'https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&prompt=consent&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fplus.profile.emails.read%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fplus.login&response_type=code&client_id='+google_id+'&redirect_uri='+google_redirect_url;
      this.buttonClass = 'btn-google';
      this.iconClass = 'fab fa-google';
    }

    if(this.socialType === 'linkedin') {
      const linkedin_id = environment.linkedin_id;
      const linkedin_redirect_url = environment.linkedin_redirect_url;
      this.urlLink = 'https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id='+linkedin_id+'&state=4Wx72xl6lDlS34Cs&redirect_uri='+linkedin_redirect_url+'&scope=r_basicprofile%20r_emailaddress';
      this.buttonClass = 'btn-linkedin';
      this.iconClass = 'fab fa-linkedin';
    }

  }

}
