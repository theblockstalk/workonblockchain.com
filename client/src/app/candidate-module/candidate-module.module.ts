import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../app-shared.module';

import { CandidateModuleRoutingModule } from './candidate-module-routing.module';

import { CandidateTermsComponent } from './candidate-terms/candidate-terms.component';
import { LinkedinImportComponent } from './linkedin-import/linkedin-import.component';
import { AboutComponent } from './about/about.component';
import { JobComponent } from './job/job.component';
import { ResumeComponent } from './resume/resume.component';
import { ExperienceComponent } from './experience/experience.component';
import {ProfileResolver} from '../incomplete-profile.resolver';
import { CandidateVerifyEmailComponent } from './candidate-verify-email/candidate-verify-email.component';
import { MatInputModule, MatSelectModule , MatAutocompleteModule} from '@angular/material';
import { CandidateProfileComponent } from './candidate-profile/candidate-profile.component';

@NgModule({
  imports: [
    CommonModule,
    CandidateModuleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule
  ],
  declarations: [
    CandidateTermsComponent,
    LinkedinImportComponent,
    AboutComponent,
    JobComponent,
    ResumeComponent,
    ExperienceComponent,
    CandidateVerifyEmailComponent,
    CandidateProfileComponent
  ],
  providers:
    [
      ProfileResolver
    ]
})
export class CandidateModuleModule { }
