import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginResolver } from '../is-loggedin.resolver';
import { CandidateFormComponent } from './candidate-form/candidate-form.component';



const routes: Routes = [ { path: '', component: CandidateFormComponent , resolve: {LoginResolver }},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],


})
export class AuthModuleRoutingModule { }
