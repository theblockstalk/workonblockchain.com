import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { CandidateTermsComponent } from './candidate-terms/candidate-terms.component';
import { LinkedinImportComponent } from './linkedin-import/linkedin-import.component';
import { AboutComponent } from './about/about.component';
import { JobComponent } from './job/job.component';
import { ResumeComponent } from './resume/resume.component';
import { ExperienceComponent } from './experience/experience.component';
import { CandidateVerifyEmailComponent } from './candidate-verify-email/candidate-verify-email.component';
import {VerifyEmailMiddleware} from '../../app/auth-module/verify-email-middleware';
import { CandidateProfileComponent } from './candidate-profile/candidate-profile.component';
import {ProfileResolver} from '../incomplete-profile.resolver';

const routes: Routes = [
  { path: 'terms-and-condition', component: CandidateTermsComponent, canActivate : [VerifyEmailMiddleware]},
  { path: 'prefill-profile', component: LinkedinImportComponent, canActivate : [VerifyEmailMiddleware]},
  { path: 'about', component: AboutComponent, canActivate : [VerifyEmailMiddleware]},
  { path: 'work', component: JobComponent, canActivate : [VerifyEmailMiddleware]},
  { path: 'resume', component: ResumeComponent, canActivate : [VerifyEmailMiddleware]},
  { path: 'experience', component: ExperienceComponent, canActivate : [VerifyEmailMiddleware]},
  { path: 'candidate-verify-email' , component: CandidateVerifyEmailComponent},
  { path: 'candidate_profile', component: CandidateProfileComponent ,  canActivate : [VerifyEmailMiddleware], resolve: {ProfileResolver}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateModuleRoutingModule { }


