import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { AdminModuleRoutingModule } from './admin-module-routing.module';
import { SharedModule } from '../app-shared.module';
import { CKEditorModule } from 'ng2-ckeditor';

import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminCandidateSearchComponent } from './admin-candidate-search/admin-candidate-search.component';
import { AdminCandidateDetailComponent } from './admin-candidate-detail/admin-candidate-detail.component';
import { AdminDisplayChatComponent } from './admin-display-chat/admin-display-chat.component';
import { AdminCompanySearchComponent } from './admin-company-search/admin-company-search.component';
import { AdminCompanyDetailComponent } from './admin-company-detail/admin-company-detail.component';
import { AdminUpdateCandidateProfileComponent } from './admin-update-candidate-profile/admin-update-candidate-profile.component';
import { StyleGuideComponent } from './style-guide/style-guide.component';
import {PagerService} from '../pager.service';
import { MatInputModule, MatSelectModule , MatAutocompleteModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    AdminModuleRoutingModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    CKEditorModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule
  ],
  declarations: [
    AdminDashboardComponent,
    AdminCandidateSearchComponent,
    AdminCandidateDetailComponent,
    AdminDisplayChatComponent,
    AdminCompanySearchComponent,
    AdminCompanyDetailComponent,
    AdminUpdateCandidateProfileComponent,
    StyleGuideComponent
  ],
  providers : [PagerService]

})
export class AdminModuleModule { }
