import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-i-forme-email-address',
  templateUrl: './email-address.component.html',
  styleUrls: ['./email-address.component.css']
})
export class EmailAddressComponent implements OnInit {
  @Input() email_address: string;
  errMsg;
  constructor() { }

  ngOnInit() {
  }

}
