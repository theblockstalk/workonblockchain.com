import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { urls } from '../routes';
import { PagesComponent } from './pages/pages.component';

const routes: Routes = [
  { path: urls.pages, component: PagesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }


