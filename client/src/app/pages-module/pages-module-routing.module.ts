import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FeesComponent } from './fees/fees.component';

const routes: Routes = [
  {path : 'contact-us' , component: ContactUsComponent},
  {path : 'fees' , component: FeesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesModuleRoutingModule { }
