import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ReferralModuleRoutingModule } from './referral-module-routing.module';

import { ReferralComponent } from './referral/referral.component';

@NgModule({
  imports: [
    CommonModule,
    ReferralModuleRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    ReferralComponent
  ]
})
export class ReferralModuleModule { }
