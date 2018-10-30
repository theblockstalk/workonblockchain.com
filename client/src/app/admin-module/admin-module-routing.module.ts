import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminCandidateSearchComponent } from './admin-candidate-search/admin-candidate-search.component';
import { AdminCandidateDetailComponent } from './admin-candidate-detail/admin-candidate-detail.component';
import { AdminDisplayChatComponent } from './admin-display-chat/admin-display-chat.component';
import { AdminCompanySearchComponent } from './admin-company-search/admin-company-search.component';
import { AdminCompanyDetailComponent } from './admin-company-detail/admin-company-detail.component';
import { AdminAccountSettingsComponent } from './admin-account-settings/admin-account-settings.component';

const routes: Routes = [
  {path : 'admin-dashboard' , component: AdminDashboardComponent},
  {path : 'admin-candidate-search' , component: AdminCandidateSearchComponent},
  {path : 'admin-candidate-detail' , component: AdminCandidateDetailComponent},
  {path : 'admin-display-chat' , component: AdminDisplayChatComponent},
  {path : 'admin-company-search' , component: AdminCompanySearchComponent},
  {path : 'admin-company-detail' , component: AdminCompanyDetailComponent},
  {path : 'admin-account-settings' , component: AdminAccountSettingsComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminModuleRoutingModule { }
