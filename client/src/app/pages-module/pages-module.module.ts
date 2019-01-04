import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../app-shared.module';
import { PagesModuleRoutingModule } from './pages-module-routing.module';

import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FeesComponent } from './fees/fees.component';
import { FaqComponent } from './faq/faq.component';
import { TermsAndConditionComponent } from './terms-and-condition/terms-and-condition.component';
import { CompanyTermsAndConditionsComponent } from './company-terms-and-conditions/company-terms-and-conditions.component';

@NgModule({
  imports: [
    CommonModule,
    PagesModuleRoutingModule,
    SharedModule
  ],
  declarations: [
    PrivacyPolicyComponent,
    ContactUsComponent,
    FeesComponent,
    FaqComponent,
    TermsAndConditionComponent,
    CompanyTermsAndConditionsComponent,
  ]
})
export class PagesModuleModule { }
