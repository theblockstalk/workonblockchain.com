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
  @Input() companyDoc: object; //optional
  @Input() viewBy: string; //company, candidate or anyone

  terms_active_class;about_active_class;pref_active_class;companyMsgTitle;
  companyMsgBody;price_plan_active_class;log;

  free_plan: any;
  starter = "Starter";
  essential = "Essential";
  unlimited = "Unlimited";

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object, private authenticationService: UserService) { }

  ngOnInit() {
    this.free_plan = {
      name: "Free till you hire", value: 'freeplan'
    };
    if (this.viewBy === 'company') {
      console.log(this.viewBy);
      console.log('in PricingComponent');
      console.log(this.companyDoc);
      if (this.companyDoc['terms_id']) this.terms_active_class = 'fa fa-check-circle text-success';
      if (this.companyDoc['company_founded'] && this.companyDoc['no_of_employees'] && this.companyDoc['company_funded'] && this.companyDoc['company_description']) this.about_active_class = 'fa fa-check-circle text-success';
      if (this.companyDoc['saved_searches'] && this.companyDoc['saved_searches'].length > 0) this.pref_active_class = 'fa fa-check-circle text-success';
      if (this.companyDoc['pricing_plan']) this.price_plan_active_class = 'fa fa-check-circle text-success';

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

  selectPlan(plan){
    if (this.viewBy === 'company') {
      console.log(this.companyDoc['_creator']._id);
      let inputQuery : any ={};
      let planSelected = plan;
      if(plan === this.free_plan.name) {
        plan = this.free_plan.value;
        planSelected = this.free_plan.name;
      }
      console.log(plan);
      if (isPlatformBrowser(this.platformId)) {
        $(".pr-col").removeClass("table-info");
        $("#div-" + plan).addClass("table-info");
      }
      inputQuery.pricing_plan = planSelected;
      this.authenticationService.edit_company_profile(this.companyDoc['_creator']._id, inputQuery, false)
      .subscribe(
        data =>{
          if(data) {
            if (isPlatformBrowser(this.platformId)) $('#whatHappensNextModal').modal('show');
          }
        },
        error => {
          if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
            this.log = error['error']['message'];
            this.router.navigate(['/not_found']);
          }
          else if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
            this.log = error['error']['message'];
            this.router.navigate(['/not_found']);
          }
          else this.log = "Something went wrong";
        }
      )
    }
  }

}
