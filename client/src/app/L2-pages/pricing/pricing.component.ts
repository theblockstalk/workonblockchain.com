import { Component, OnInit, Input, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import {isPlatformBrowser} from "@angular/common";
import {UserService} from '../../user.service';
declare var $:any;

@Component({
  selector: 'app-p-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent implements OnInit {
  @Input() pricingDoc: object;
  @Input() viewBy: string; //company, candidate or anyone

  terms_active_class;about_active_class;pref_active_class;companyMsgTitle;
  companyMsgBody;

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object, private authenticationService: UserService) { }

  ngOnInit() {
    if (this.viewBy === 'company') {
      console.log(this.viewBy);
      console.log('in PricingComponent');
      console.log(this.pricingDoc);
      if (this.pricingDoc['terms_id']) this.terms_active_class = 'fa fa-check-circle text-success';
      if (this.pricingDoc['company_founded'] && this.pricingDoc['no_of_employees'] && this.pricingDoc['company_funded'] && this.pricingDoc['company_description']) this.about_active_class = 'fa fa-check-circle text-success';
      if (this.pricingDoc['saved_searches'] && this.pricingDoc['saved_searches'].length > 0) this.pref_active_class = 'fa fa-check-circle text-success';

      this.authenticationService.get_page_content('Company popup message')
      .subscribe(
        data => {
          if(data){
            this.companyMsgTitle= data['page_title'];
            this.companyMsgBody = data['page_content'];
          }
        }
      );
    }
  }

  price_plan(){
    console.log('clicked');
    if (isPlatformBrowser(this.platformId)) $('#whatHappensNextModal').modal('show');
  }

  redirectToCompany() {
    if (isPlatformBrowser(this.platformId)) $('#whatHappensNextModal').modal('hide');
    this.router.navigate(['/candidate-search']);
  }

  selectPlan(id){
    console.log(id);
    if (isPlatformBrowser(this.platformId)) {
      $(".pr-col").removeClass("table-info");
      $("#div-" + id).addClass("table-info");
    }
  }

}
