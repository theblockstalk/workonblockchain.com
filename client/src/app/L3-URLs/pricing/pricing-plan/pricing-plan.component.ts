import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-u-pricing-plan',
  templateUrl: './pricing-plan.component.html',
  styleUrls: ['./pricing-plan.component.css']
})
export class PricingPlanComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log('in pricing page URL for comp wizard');
  }

}
