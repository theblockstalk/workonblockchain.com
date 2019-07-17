import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminModuleRoutingModule } from './admin-module-routing.module';
import { SharedModule } from '../app-shared.module';

import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminCandidateSearchComponent } from './admin-candidate-search/admin-candidate-search.component';
import { AdminDisplayChatComponent } from './admin-display-chat/admin-display-chat.component';
import { AdminCompanySearchComponent } from './admin-company-search/admin-company-search.component';
import { AdminCompanyDetailComponent } from './admin-company-detail/admin-company-detail.component';
import { AdminUpdateCandidateProfileComponent } from './admin-update-candidate-profile/admin-update-candidate-profile.component';
import { StyleGuideComponent } from './style-guide/style-guide.component';
import {PagerService} from '../pager.service';
import { MatInputModule, MatSelectModule , MatAutocompleteModule} from '@angular/material';
import { AdminUpdateCompanyProfileComponent } from './admin-update-company-profile/admin-update-company-profile.component';

@NgModule({
  imports: [
    CommonModule,
    AdminModuleRoutingModule,
    SharedModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule
  ],
  declarations: [
    AdminDashboardComponent,
    AdminCandidateSearchComponent,
    AdminDisplayChatComponent,
    AdminCompanySearchComponent,
    AdminCompanyDetailComponent,
    AdminUpdateCandidateProfileComponent,
    StyleGuideComponent,
    AdminUpdateCompanyProfileComponent
  ],
  providers : [PagerService]

})
export class AdminModuleModule { }
