import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Select2Module } from 'ng2-select2';
import {NgxPaginationModule} from 'ngx-pagination';
import { CKEditorModule } from 'ng2-ckeditor';

import { CompanyModuleRoutingModule } from './company-module-routing.module';
import { AboutCompanyComponent } from './about-company/about-company.component';
import { TermsWizardComponent } from './terms-wizard/terms-wizard.component';
import { CompanySearchComponent } from './company-search/company-search.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { EditCompanyProfileComponent } from './edit-company-profile/edit-company-profile.component';


@NgModule({
  imports: [
    CommonModule,
    CompanyModuleRoutingModule,
    FormsModule,
    Select2Module,
    NgxPaginationModule,
    CKEditorModule
  ],
  declarations: [
    AboutCompanyComponent,
    TermsWizardComponent,
    CompanySearchComponent,
    CompanyProfileComponent,
    EditCompanyProfileComponent
  ]
})
export class CompanyModuleModule { }
