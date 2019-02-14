import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutCompanyComponent } from './about-company/about-company.component';
import { TermsWizardComponent } from './terms-wizard/terms-wizard.component';
import { CompanySearchComponent } from './company-search/company-search.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { EditCompanyProfileComponent } from './edit-company-profile/edit-company-profile.component';
import { CandidateDetailComponent } from './candidate-detail/candidate-detail.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { CompanyVerifyEmailComponent } from './company-verify-email/company-verify-email.component';

const routes: Routes = [
  {path : 'about_comp' , component: AboutCompanyComponent},
  { path: 'company_wizard', component: TermsWizardComponent},
  {path : 'candidate-search' , component: CompanySearchComponent},
  {path : 'company_profile' , component: CompanyProfileComponent},
  {path : 'edit_company_profile' , component: EditCompanyProfileComponent},
  {path : 'candidate-detail' , component: CandidateDetailComponent},
  {path : 'preferences' , component: PreferencesComponent},
  {path :  'company-verify-email', component: CompanyVerifyEmailComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyModuleRoutingModule { }
