import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../app-shared.module';

import {AuthModuleRoutingModule} from './auth-module-routing.module';

import { CandidateFormComponent } from './candidate-form/candidate-form.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { NotFoundComponent } from './not-found/not-found.component';

import {LoginResolver} from '../is-loggedin.resolver';
import { SocialAuthComponent } from './social-auth/social-auth.component';
import { LinkedinAuthComponent } from './linkedin-auth/linkedin-auth.component';

@NgModule({
  imports: [
    CommonModule,
    AuthModuleRoutingModule,
    SharedModule
  ],
  declarations: [
    CandidateFormComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    AccountSettingsComponent,
    ChangePasswordComponent,
    VerifyEmailComponent,
    NotFoundComponent,
    SocialAuthComponent,
    LinkedinAuthComponent
  ],
  providers:
    [
      LoginResolver,
    ]
})
export class AuthModuleModule { }
