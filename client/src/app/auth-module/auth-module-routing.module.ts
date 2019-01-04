import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginResolver } from '../is-loggedin.resolver';
import { CandidateFormComponent } from './candidate-form/candidate-form.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  { path : 'signup', component: CandidateFormComponent , resolve: {LoginResolver }},
  { path : 'login', component: LoginComponent , resolve: {LoginResolver }},
  { path : 'forgot_password', component: ForgotPasswordComponent},
  { path : 'reset_password', component: ResetPasswordComponent},
  { path : 'refer', component: CandidateFormComponent},
  { path : 'account-settings' , component: AccountSettingsComponent},
  { path : 'change-password' , component: ChangePasswordComponent},
  { path : 'verify_email', component: VerifyEmailComponent},
  { path : 'not_found' , component: NotFoundComponent},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],


})
export class AuthModuleRoutingModule { }