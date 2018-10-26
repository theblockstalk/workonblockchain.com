import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesModuleRoutingModule } from './pages-module-routing.module';

import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { FeesComponent } from './fees/fees.component';
import { FaqComponent } from './faq/faq.component';
import { TermsAndConditionComponent } from './terms-and-condition/terms-and-condition.component';
import { CompanyTermsAndConditionsComponent } from './company-terms-and-conditions/company-terms-and-conditions.component';

@NgModule({
  imports: [
    CommonModule,
    PagesModuleRoutingModule,
  ],
  declarations: [
    PrivacyPolicyComponent,
    ContactUsComponent,
    LegalNoticeComponent,
    FeesComponent,
    FaqComponent,
    TermsAndConditionComponent,
    CompanyTermsAndConditionsComponent,
  ]
})
export class PagesModuleModule { }
