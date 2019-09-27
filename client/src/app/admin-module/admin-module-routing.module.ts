import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminCandidateSearchComponent } from './admin-candidate-search/admin-candidate-search.component';
import { AdminDisplayChatComponent } from './admin-display-chat/admin-display-chat.component';
import { AdminCompanySearchComponent } from './admin-company-search/admin-company-search.component';
import { AdminCompanyDetailComponent } from './admin-company-detail/admin-company-detail.component';
import { AdminUpdateCandidateProfileComponent } from './admin-update-candidate-profile/admin-update-candidate-profile.component';
import { StyleGuideComponent } from './style-guide/style-guide.component';
import { AdminUpdateCompanyProfileComponent } from './admin-update-company-profile/admin-update-company-profile.component';
import { AdminCandidateDetailComponent } from './admin-candidate-detail/admin-candidate-detail.component';
import { AdminTimeframeSearchComponent } from './admin-timeframe-search/admin-timeframe-search.component';

const routes: Routes = [
  {path : 'admin-dashboard' , component: AdminDashboardComponent},
  {path : 'admin-candidate-search' , component: AdminCandidateSearchComponent},
  {path : 'admin-display-chat' , component: AdminDisplayChatComponent},
  {path : 'admin-company-search' , component: AdminCompanySearchComponent},
  {path : 'admin-company-detail' , component: AdminCompanyDetailComponent},
  {path : 'update-candidate-profile' , component : AdminUpdateCandidateProfileComponent },
  { path : 'style-guide' , component : StyleGuideComponent},
  {path : 'update-company-profile' , component : AdminUpdateCompanyProfileComponent },
  {path : 'admin-candidate-detail' , component: AdminCandidateDetailComponent},
  {path : 'admin-timeframe-search', component: AdminTimeframeSearchComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminModuleRoutingModule { }
