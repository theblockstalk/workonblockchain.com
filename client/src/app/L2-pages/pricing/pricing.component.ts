import { Component, OnInit, Input, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import {isPlatformBrowser} from "@angular/common";
import {UserService} from '../../user.service';
import { Title, Meta } from '@angular/platform-browser';
import { constants } from "../../../constants/constants";
declare var $:any;

@Component({
  selector: 'app-p-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent implements OnInit {
  @Input() companyDoc: object; //optional
  @Input() viewBy: string; //company, candidate or anyone
  @Input() showNavbar: boolean; //to show navbar for comp wizard

  terms_active_class;about_active_class;pref_active_class;companyMsgTitle;
  companyMsgBody;price_plan_active_class;log;gdpr_compliance_active_class;
  gdpr_disable;

  free_plan: any;
  starter = "Starter";
  essential = "Essential";
  unlimited = "Unlimited";

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object, private authenticationService: UserService, private titleService: Title,private newMeta: Meta) {
    this.titleService.setTitle('Work on Blockchain | Pricing for companies');
  }

  ngOnInit() {
    this.gdpr_disable = 'disabled';
    this.newMeta.updateTag({ name: 'description', content: 'Pricing for hiring companies that use the workonblockchain.com blockchain recruitment platform to hire developers and technical professionals.' });
    this.newMeta.updateTag({ name: 'keywords', content: 'Pricing workonblockchain.com' });
    this.free_plan = {
      name: "Free till you hire", value: 'freeplan'
    };
    if (this.viewBy === 'company') {
      if (this.companyDoc['terms_id']) this.terms_active_class = 'fa fa-check-circle text-success';
      if (this.companyDoc['company_founded'] && this.companyDoc['no_of_employees'] && this.companyDoc['company_funded'] && this.companyDoc['company_description']) this.about_active_class = 'fa fa-check-circle text-success';
      if (this.companyDoc['saved_searches'] && this.companyDoc['saved_searches'].length > 0) this.pref_active_class = 'fa fa-check-circle text-success';
      if (this.companyDoc['pricing_plan']) this.price_plan_active_class = 'fa fa-check-circle text-success';

      if(constants.eu_countries.indexOf(this.companyDoc['company_country']) === -1) {
        if ((this.companyDoc['canadian_commercial_company'] === true || this.companyDoc['canadian_commercial_company'] === false) || (this.companyDoc['usa_privacy_shield'] === true || this.companyDoc['usa_privacy_shield'] === false) || this.companyDoc['dta_doc_link']) {
          this.gdpr_disable = '';
          this.gdpr_compliance_active_class = 'fa fa-check-circle text-success';
        }
      }

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
    if (isPlatformBrowser(this.platformId)) $('#whatHappensNextModal').modal('show');
  }

  redirectToCompany() {
    if (isPlatformBrowser(this.platformId)) $('#whatHappensNextModal').modal('hide');
    this.router.navigate(['/candidate-search']);
  }

  selectPlan(plan){
    if (this.viewBy === 'company') {
      let inputQuery : any ={};
      let planSelected = plan;
      if(plan === this.free_plan.name) {
        plan = this.free_plan.value;
        planSelected = this.free_plan.name;
      }
      if (isPlatformBrowser(this.platformId)) {
        $(".pr-col").removeClass("table-info");
        $("#div-" + plan).addClass("table-info");
      }
      inputQuery.pricing_plan = planSelected;
      this.authenticationService.edit_company_profile(this.companyDoc['_creator']._id, inputQuery, false)
      .subscribe(
        data =>{
          if(data) {
            if(this.showNavbar){
              if(constants.eu_countries.indexOf(data['company_country']) === -1) {
                //non EU, go to gdpr compliance page
                this.router.navigate(['/gdpr-compliance']);
              }
              else{
                if (isPlatformBrowser(this.platformId)) $('#whatHappensNextModal').modal('show');
              }
            }
            else this.router.navigate(['/users/company']);
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

  internalRoute(page,dst){
    //this.sectionScroll=dst;
    this.router.navigate([page], {fragment: dst});
  }

}
