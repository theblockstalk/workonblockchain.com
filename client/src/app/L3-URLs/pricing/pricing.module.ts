import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../app-shared.module';

import { PricingRoutingModule } from './pricing-routing.module';

import { ProfileResolver } from '../../incomplete-profile.resolver';
import { PricingPlanComponent } from './pricing-plan/pricing-plan.component';

@NgModule({
  imports: [
    CommonModule,
    PricingRoutingModule,
    SharedModule,
  ],
  declarations: [
    PricingPlanComponent
  ],
  providers: [
    ProfileResolver
  ]
})
export class PricingModule { }
