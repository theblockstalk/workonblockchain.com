import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import { CKEditorModule } from 'ng2-ckeditor';
import { Select2Module } from 'ng2-select2';
import { SharedModule } from '../app-shared.module';
import {NgxPaginationModule} from 'ngx-pagination';
import { CompanyModuleRoutingModule } from './company-module-routing.module';
import { AboutCompanyComponent } from './about-company/about-company.component';
import { TermsWizardComponent } from './terms-wizard/terms-wizard.component';
import { CompanySearchComponent } from './company-search/company-search.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { EditCompanyProfileComponent } from './edit-company-profile/edit-company-profile.component';
import { PreferencesComponent } from './preferences/preferences.component';
import {PagerService} from '../pager.service';
import { CompanyVerifyEmailComponent } from './company-verify-email/company-verify-email.component';
import { CompaniesLandingPageComponent } from './companies-landing-page/companies-landing-page.component';
import { CandidateDetailComponent } from './candidate-detail/candidate-detail.component';

import { MatInputModule, MatSelectModule , MatAutocompleteModule} from '@angular/material';


@NgModule({
  imports: [
    CommonModule,
    CompanyModuleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    SharedModule,
    Select2Module,
    NgxPaginationModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule
  ],
  declarations: [
    AboutCompanyComponent,
    TermsWizardComponent,
    CompanySearchComponent,
    CompanyProfileComponent,
    EditCompanyProfileComponent,
    PreferencesComponent,
    CompanyVerifyEmailComponent,
    CompaniesLandingPageComponent,
    CandidateDetailComponent
  ],
  providers : [PagerService]
})
export class CompanyModuleModule {
  constructor() {
  }
}
