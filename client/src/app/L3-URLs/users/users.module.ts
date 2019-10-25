import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../app-shared.module';
import { UsersRoutingModule } from './users.routing.module';
import { EditCandidateProfileComponent } from './talent/edit/edit-candidate-profile.component';
import { CandidateDetailsComponent } from './companies/candidate-details/candidate-details.component';
import { CandidateProfileComponent } from './talent/view/candidate-profile/candidate-profile.component';
import { ProfileResolver } from '../../incomplete-profile.resolver';
import { ViewComponent } from './companies/view/view.component';
import { CompanyAddJobComponent } from './companies/jobs/company-add-job/company-add-job.component';
import { CompanyViewJobComponent } from './companies/jobs/company-view-job/company-view-job.component';

@NgModule({
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
  ],
  declarations: [
    EditCandidateProfileComponent,
    CandidateDetailsComponent,
    CandidateProfileComponent,
    ViewComponent,
    CompanyAddJobComponent,
    CompanyViewJobComponent
  ],
  providers: [
    ProfileResolver
  ]
})
export class UsersModule { }
