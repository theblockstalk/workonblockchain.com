import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../app-shared.module';

import { TalentRoutingModule } from './talent-routing.module';

import { ProfileResolver } from '../../incomplete-profile.resolver';
import { EditCandidateProfileComponent } from './talent/edit/edit-candidate-profile/edit-candidate-profile.component';

@NgModule({
  imports: [
    CommonModule,
    TalentRoutingModule,
    SharedModule,
  ],
  declarations: [
    EditCandidateProfileComponent
  ],
  providers: [
    ProfileResolver
  ]
})
export class TalentModule { }
