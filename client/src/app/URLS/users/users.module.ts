import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../app-shared.module';

import { UsersRoutingModule } from './users.routing.module';

import { CandidateDetailsComponent } from '../users/companies/candidate-details/candidate-details.component';
import { CandidateProfileComponent } from '../users/talent/view/candidate-profile/candidate-profile.component';

@NgModule({
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
  ],
  declarations: [
    CandidateDetailsComponent,
    CandidateProfileComponent
  ],
  providers: [
  ]
})
export class UsersModule { }
