import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../app-shared.module';
import { CandidateEditComponent } from '../L2-pages/candidate-edit/candidate-edit.component';

import { CandidateModuleRoutingModule } from './candidate-module-routing.module';

import { CandidateTermsComponent } from './candidate-terms/candidate-terms.component';
import { LinkedinImportComponent } from './linkedin-import/linkedin-import.component';
import { AboutComponent } from './about/about.component';
import { JobComponent } from './job/job.component';
import { ResumeComponent } from './resume/resume.component';
import { ExperienceComponent } from './experience/experience.component';
import { CandidateProfileComponent } from './candidate-profile/candidate-profile.component';
import { EditCandidateProfileComponent } from '../URLS/users/talent/edit/edit-candidate-profile/edit-candidate-profile.component';
import {ProfileResolver} from '../incomplete-profile.resolver';
import { CandidateVerifyEmailComponent } from './candidate-verify-email/candidate-verify-email.component';
import { MatInputModule, MatSelectModule , MatAutocompleteModule} from '@angular/material';

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
    CandidateProfileComponent,
    //CandidateEditComponent, //page component
    EditCandidateProfileComponent,
    CandidateVerifyEmailComponent
  ],
  providers:
    [
      ProfileResolver
    ]
})
export class CandidateModuleModule { }
