import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CandidateTermsComponent } from './candidate-terms/candidate-terms.component';
import { LinkedinImportComponent } from './linkedin-import/linkedin-import.component';
import { AboutComponent } from './about/about.component';
import { JobComponent } from './job/job.component';
import { ResumeComponent } from './resume/resume.component';
import { ExperienceComponent } from './experience/experience.component';

const routes: Routes = [
  { path: 'terms-and-condition', component: CandidateTermsComponent},
  { path: 'prefill-profile', component: LinkedinImportComponent},
  { path: 'about', component: AboutComponent},
  { path: 'job', component: JobComponent},
  { path: 'resume', component: ResumeComponent},
  { path: 'experience', component: ExperienceComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateModuleRoutingModule { }
