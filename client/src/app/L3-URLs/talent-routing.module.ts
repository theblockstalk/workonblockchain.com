import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { urls } from './routes';
import { AdminTalentEditComponent } from './admins/talent/edit/admin-talent-edit.component';
import { PagesEditComponent } from './admins/pages/pages-edit.component';
import { AdminTalentViewComponent } from './admins/talent/view/admin-talent-view.component';
import { CompanyViewComponent } from './admins/company/company-view/company-view.component';
import { AddJobComponent } from './admins/company/jobs/add-job/add-job.component';

const routes: Routes = [
  { path: urls.admins_talent_edit , component: AdminTalentEditComponent},
  { path: urls.admins_pages_edit, component: PagesEditComponent},
  { path: urls.admin_talent_view, component: AdminTalentViewComponent},
  { path: urls.admin_company_view, component: CompanyViewComponent},
  { path: urls.admin_jobs_add, component: AddJobComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TalentRoutingModule { }


