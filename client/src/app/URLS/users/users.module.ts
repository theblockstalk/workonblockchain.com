import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../app-shared.module';
import { UsersRoutingModule } from './users.routing.module';
import { EditCandidateProfileComponent } from '../users/talent/edit/edit-candidate-profile.component';
import { CandidateDetailsComponent } from '../users/companies/candidate-details/candidate-details.component';
import { CandidateProfileComponent } from '../users/talent/view/candidate-profile/candidate-profile.component';
import { ProfileResolver } from '../../incomplete-profile.resolver';

@NgModule({
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
  ],
  declarations: [
    EditCandidateProfileComponent,
    CandidateDetailsComponent,
    CandidateProfileComponent
  ],
  providers: [
    ProfileResolver
  ]
})
export class UsersModule { }
