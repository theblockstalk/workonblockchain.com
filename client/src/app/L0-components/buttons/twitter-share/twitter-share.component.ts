import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'L0-twitter-share',
  templateUrl: './twitter-share.component.html',
  styleUrls: ['./twitter-share.component.css']
})
export class TwitterShareComponent implements OnInit {
  @Input() twitterLink;
  @Input() label;
  @Input() text;
  constructor() { }

  ngOnInit() {
  }

}
