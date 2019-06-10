import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-c-button-twitter-share',
  templateUrl: './twitter-share.component.html',
  styleUrls: ['./twitter-share.component.css']
})
export class TwitterShareComponent implements OnInit {
  @Input() tweet: string;
  twitterLink;

  constructor() { }

  ngOnInit() {
    this.twitterLink = 'https://twitter.com/intent/tweet?text=' + this.tweet;
  }

}
