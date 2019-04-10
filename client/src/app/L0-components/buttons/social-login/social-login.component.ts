import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-social-login',
  templateUrl: './social-login.component.html',
  styleUrls: ['./social-login.component.css']
})
export class SocialLoginComponent implements OnInit {
  @Input() label;
  @Input() urlLink;
  @Input() buttonClass;
  constructor() { }

  ngOnInit() {
  }

}
