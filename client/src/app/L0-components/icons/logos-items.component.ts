import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-c-icon',
  templateUrl: './logos-items.component.html',
  styleUrls: ['./logos-items.component.css']
})
export class LogosItemsComponent implements OnInit {
  @Input() value: string; // "bitcoin", "ethereum", .......
  @Input() type: string; // "blockchain"
  srcUrl: string;
  altText: string;
  constructor() { }

  ngOnInit() {
    if(this.type === 'blockchain') {
      this.srcUrl = '/assets/images/all_icons/blockchain/' + this.value + '.png';
    }
    this.altText = this.value;
  }

}
