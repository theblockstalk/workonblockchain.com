import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';

import { ReferralComponent } from './referral/referral.component';
import {VerifyEmailMiddleware} from '../../app/auth-module/verify-email-middleware';

const routes: Routes = [
  { path: 'referral', component: ReferralComponent, canActivate: [VerifyEmailMiddleware]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReferralModuleRoutingModule { }
