import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReferralComponent } from './referral/referral.component';

const routes: Routes = [
  { path: 'referral', component: ReferralComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReferralModuleRoutingModule { }
