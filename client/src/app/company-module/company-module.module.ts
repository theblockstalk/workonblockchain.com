import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import { CKEditorModule } from 'ng2-ckeditor';
import { SharedModule } from '../app-shared.module';

import { CompanyModuleRoutingModule } from './company-module-routing.module';
import { AboutCompanyComponent } from './about-company/about-company.component';
import { TermsWizardComponent } from './terms-wizard/terms-wizard.component';
import { CompanySearchComponent } from './company-search/company-search.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { EditCompanyProfileComponent } from './edit-company-profile/edit-company-profile.component';
import { CandidateDetailComponent } from './candidate-detail/candidate-detail.component';
import { PreferencesComponent } from './preferences/preferences.component';
//import {PagerService} from '../pager.service';


@NgModule({
  imports: [
    CommonModule,
    CompanyModuleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    CKEditorModule,
    SharedModule,
  ],
  declarations: [
    AboutCompanyComponent,
    TermsWizardComponent,
    CompanySearchComponent,
    CompanyProfileComponent,
    EditCompanyProfileComponent,
    CandidateDetailComponent,
    PreferencesComponent
  ],
  //providers : [PagerService]
})
export class CompanyModuleModule {
  constructor() {
  }
}
