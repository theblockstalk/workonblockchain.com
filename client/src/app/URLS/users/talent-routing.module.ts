import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { urls } from '../../URLS/routes';
import { EditCandidateProfileComponent } from './talent/edit/edit-candidate-profile/edit-candidate-profile.component';
import {ProfileResolver} from '../../incomplete-profile.resolver';
import {VerifyEmailMiddleware} from '../../../app/auth-module/verify-email-middleware';

const routes: Routes = [
   { path: urls.talent_edit , component: EditCandidateProfileComponent, canActivate : [VerifyEmailMiddleware], resolve: {ProfileResolver}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateModuleRoutingModule { }


