import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FeesComponent } from './fees/fees.component';
import { FaqComponent } from './faq/faq.component';
import { TermsAndConditionComponent } from './terms-and-condition/terms-and-condition.component';
import { CompanyTermsAndConditionsComponent } from './company-terms-and-conditions/company-terms-and-conditions.component';

const routes: Routes = [
  {path : 'privacy-notice' , component: PrivacyPolicyComponent},
  {path : 'contact-us' , component: ContactUsComponent},
  {path : 'fees' , component: FeesComponent},
  {path : 'faq' , component: FaqComponent},
  {path : 'terms-for-candidate' , component: TermsAndConditionComponent},
  {path : 'terms-for-company' , component: CompanyTermsAndConditionsComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesModuleRoutingModule { }
