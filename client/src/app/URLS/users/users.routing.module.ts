import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { urls } from '../routes';
import { CandidateDetailsComponent } from '../users/companies/candidate-details/candidate-details.component';
import { CandidateProfileComponent } from '../users/talent/view/candidate-profile/candidate-profile.component';

const routes: Routes = [
  { path: urls.company_talent_view, component: CandidateDetailsComponent},
  { path: urls.candidate_profile_view, component: CandidateProfileComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }


