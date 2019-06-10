import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../app-shared.module';
import {ScriptService} from '../scripts/script.service';

import { ReferralModuleRoutingModule } from './referral-module-routing.module';

import { ReferralComponent } from './referral/referral.component';

@NgModule({
  imports: [
    CommonModule,
    ReferralModuleRoutingModule,
    SharedModule
  ],
  declarations: [
    ReferralComponent
  ],
  providers : [ScriptService]

})
export class ReferralModuleModule {
  constructor(private scriptService : ScriptService) {
    this.scriptService.load('twitterWidget').then(data => {
    }).catch(error => console.log(error));
  }
}
