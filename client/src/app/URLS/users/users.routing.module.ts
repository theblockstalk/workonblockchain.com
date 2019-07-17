import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { urls } from '../routes';
import { CandidateDetailsComponent } from '../users/companies/candidate-details/candidate-details.component';
import { CandidateProfileComponent } from '../users/talent/view/candidate-profile/candidate-profile.component';
import { ProfileResolver } from '../../incomplete-profile.resolver';
import { VerifyEmailMiddleware } from '../../auth-module/verify-email-middleware';
import { EditCandidateProfileComponent } from '../users/talent/edit/edit-candidate-profile.component';

const routes: Routes = [
  { path: urls.users_talent_edit , component: EditCandidateProfileComponent, canActivate : [VerifyEmailMiddleware], resolve: {ProfileResolver}},
  { path: urls.company_talent_view, component: CandidateDetailsComponent},
  { path: urls.candidate_talent_view, component: CandidateProfileComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }


