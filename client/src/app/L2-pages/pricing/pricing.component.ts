import { Component, OnInit, Input, ViewChild  } from '@angular/core';

@Component({
  selector: 'app-p-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent implements OnInit {
  @Input() pricingDoc: object;
  @Input() viewBy: string; //company, candidate or anyone

  terms_active_class;about_active_class;pref_active_class;

  constructor() { }

  ngOnInit() {
    if (this.viewBy === 'company') {
      console.log(this.viewBy);
      console.log('in PricingComponent');
      console.log(this.pricingDoc);
      if (this.pricingDoc['terms_id']) this.terms_active_class = 'fa fa-check-circle text-success';
      if (this.pricingDoc['company_founded'] && this.pricingDoc['no_of_employees'] && this.pricingDoc['company_funded'] && this.pricingDoc['company_description']) this.about_active_class = 'fa fa-check-circle text-success';
      if (this.pricingDoc['saved_searches'] && this.pricingDoc['saved_searches'].length > 0) this.pref_active_class = 'fa fa-check-circle text-success';
    }
  }

  price_plan(){
    console.log('clicked');
  }

}
