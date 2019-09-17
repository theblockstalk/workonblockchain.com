import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { urls } from '../routes';
import { CandidateDetailsComponent } from './companies/candidate-details/candidate-details.component';
import { CandidateProfileComponent } from './talent/view/candidate-profile/candidate-profile.component';
import { ProfileResolver } from '../../incomplete-profile.resolver';
import { VerifyEmailMiddleware } from '../../auth-module/verify-email-middleware';
import { EditCandidateProfileComponent } from './talent/edit/edit-candidate-profile.component';
import { ViewComponent } from './companies/view/view.component';

const routes: Routes = [
  { path: urls.users_talent_edit , component: EditCandidateProfileComponent, canActivate : [VerifyEmailMiddleware], resolve: {ProfileResolver}},
  { path: urls.company_talent_view, component: CandidateDetailsComponent, canActivate : [VerifyEmailMiddleware]},
  { path: urls.candidate_talent_view, component: CandidateProfileComponent, canActivate : [VerifyEmailMiddleware], resolve: {ProfileResolver}},
  { path: urls.company_profile_view, component: ViewComponent, canActivate : [VerifyEmailMiddleware] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }


