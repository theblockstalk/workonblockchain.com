import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutCompanyComponent } from './about-company/about-company.component';
import { TermsWizardComponent } from './terms-wizard/terms-wizard.component';
import { CompanySearchComponent } from './company-search/company-search.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { EditCompanyProfileComponent } from './edit-company-profile/edit-company-profile.component';

const routes: Routes = [
  {path : 'about_comp' , component: AboutCompanyComponent},
  { path: 'company_wizard', component: TermsWizardComponent},
  {path : 'candidate-search' , component: CompanySearchComponent},
  {path : 'company_profile' , component:CompanyProfileComponent},
  {path : 'edit_company_profile' , component: EditCompanyProfileComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyModuleRoutingModule { }
