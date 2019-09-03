import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { urls } from './../routes';
import { PricingPlanComponent } from './pricing-plan/pricing-plan.component';

const routes: Routes = [
  { path: urls.company_wizard_price_plan , component: PricingPlanComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PricingRoutingModule { }


