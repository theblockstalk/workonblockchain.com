import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmailTemplatesComponent } from './email-templates/email-templates.component';

const routes: Routes = [
  {path : 'admin-email-template-editor' , component: EmailTemplatesComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminEditorModuleRoutingModule {
}
