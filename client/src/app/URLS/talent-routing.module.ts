import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { urls } from './routes';
import { EditCandidateProfileComponent } from './users/talent/edit/edit-candidate-profile.component';
import { AdminTalentEditComponent } from './admins/talent/edit/admin-talent-edit.component';
import {ProfileResolver} from '../incomplete-profile.resolver';
import {VerifyEmailMiddleware} from '../auth-module/verify-email-middleware';
import { PagesEditComponent } from './admins/pages/pages-edit.component';

const routes: Routes = [
  { path: urls.users_talent_edit , component: EditCandidateProfileComponent, canActivate : [VerifyEmailMiddleware], resolve: {ProfileResolver}},
  { path: urls.admins_talent_edit , component: AdminTalentEditComponent},
  { path: urls.admins_pages_edit, component: PagesEditComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TalentRoutingModule { }


