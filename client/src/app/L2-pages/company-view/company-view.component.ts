import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';

declare var $: any;

@Component({
  selector: 'app-p-company-view',
  templateUrl: './company-view.component.html',
  styleUrls: ['./company-view.component.css']
})
export class CompanyViewComponent implements OnInit {
  @Input() userDoc: object;
  @Input() viewBy: string; // admin, company

  constructor() { }

  ngOnInit() {
    console.log(this.viewBy);
    console.log('in company view page level');
    console.log(this.userDoc);
  }

}
