import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: '', component: HomeComponent},
  { path: '', loadChildren: './auth-module/auth-module.module#AuthModuleModule'},
  { path: '', loadChildren: './pages-module/pages-module.module#PagesModuleModule'},
  { path: '', loadChildren: './referral-module/referral-module.module#ReferralModuleModule'},
  { path: '', loadChildren: './candidate-module/candidate-module.module#CandidateModuleModule'},
  { path: '', loadChildren: './chat-module/chat-module.module#ChatModuleModule'},
  { path: '', loadChildren: './company-module/company-module.module#CompanyModuleModule'},
  { path: '', loadChildren: './admin-module/admin-module.module#AdminModuleModule'},
  { path: '', loadChildren: './admin-editor-module/admin-editor-module.module#AdminEditorModuleModule'},
  { path: '', loadChildren: './L3-URLs/talent.module#TalentModule'},
  { path: '', loadChildren: './L3-URLs/pages/pages.module#PagesModule'},
  { path: '', loadChildren: './L3-URLs/users/users.module#UsersModule'},
  { path: '', loadChildren: './L3-URLs/pricing/pricing.module#PricingModule'},
  { path: '**', component: PageNotFoundComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
