import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutCompanyComponent } from './about-company/about-company.component';
import { TermsWizardComponent } from './terms-wizard/terms-wizard.component';
import { CompanySearchComponent } from './company-search/company-search.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { EditCompanyProfileComponent } from './edit-company-profile/edit-company-profile.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { CompanyVerifyEmailComponent } from './company-verify-email/company-verify-email.component';
import {VerifyEmailMiddleware} from '../../app/auth-module/verify-email-middleware';
import { CompaniesLandingPageComponent } from './companies-landing-page/companies-landing-page.component';

const routes: Routes = [
  {path : 'about_comp' , component: AboutCompanyComponent, canActivate : [VerifyEmailMiddleware]},
  {path: 'company_wizard', component: TermsWizardComponent, canActivate : [VerifyEmailMiddleware]},
  {path : 'candidate-search' , component: CompanySearchComponent, canActivate : [VerifyEmailMiddleware]},
  {path : 'company_profile' , component: CompanyProfileComponent, canActivate : [VerifyEmailMiddleware]},
  {path : 'edit_company_profile' , component: EditCompanyProfileComponent, canActivate : [VerifyEmailMiddleware]},
  {path : 'preferences' , component: PreferencesComponent, canActivate : [VerifyEmailMiddleware]},
  {path : 'company-verify-email', component: CompanyVerifyEmailComponent},
  {path : 'companies', component: CompaniesLandingPageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyModuleRoutingModule { }
