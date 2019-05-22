import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-c-icon-block-tech',
  templateUrl: './logos-items.component.html',
  styleUrls: ['./logos-items.component.css']
})
export class LogosItemsComponent implements OnInit {
  @Input() value: string; // "bitcoin", "ethereum", .......
  displayText;
  srcUrl;
  altText;
  constructor() { }

  ngOnInit() {
    this.srcUrl = '/assets/images/all_icons/blockchain/' + this.value + '.png';
    this.altText = this.value;
    this.displayText = this.value;

  }

}
