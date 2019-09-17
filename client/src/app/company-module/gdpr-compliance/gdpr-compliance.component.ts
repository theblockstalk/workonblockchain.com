import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gdpr-compliance',
  templateUrl: './gdpr-compliance.component.html',
  styleUrls: ['./gdpr-compliance.component.css']
})
export class GDPRComplianceComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log('in GDPRComplianceComponent');
  }

}
