import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'L0-logos-items',
  templateUrl: './logos-items.component.html',
  styleUrls: ['./logos-items.component.css']
})
export class LogosItemsComponent implements OnInit {
  @Input() name;
  displayText;
  srcUrl;
  altText;
  constructor() { }

  ngOnInit() {
    this.srcUrl = '/assets/images/all_icons/blockchain/' + this.name + '.png';
    this.altText = this.name;
    this.displayText = this.name;

  }

}
