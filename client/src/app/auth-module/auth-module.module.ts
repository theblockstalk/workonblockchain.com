import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SocialLoginModule, AuthServiceConfig } from 'angular4-social-login';
import { GoogleLoginProvider } from 'angular4-social-login';
import { LinkedInSdkModule } from 'angular-linkedin-sdk';

import {AuthModuleRoutingModule} from './auth-module-routing.module';

import { CandidateFormComponent } from './candidate-form/candidate-form.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ReferComponent } from './refer/refer.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { NotFoundComponent } from './not-found/not-found.component';

import {LoginResolver} from '../is-loggedin.resolver';

import { environment } from '../../environments/environment';

const google_id = environment.google_id;
const linkedin_id = environment.linkedin_id;

const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider : new GoogleLoginProvider(google_id)
  }
]);

export function provideConfig() {
  return config;
}


@NgModule({
  imports: [
    CommonModule,
    AuthModuleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SocialLoginModule,
    LinkedInSdkModule
  ],
  declarations: [
    CandidateFormComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ReferComponent,
    AccountSettingsComponent,
    ChangePasswordComponent,
    VerifyEmailComponent,
    NotFoundComponent
  ],
  providers:
    [
      LoginResolver,
      {
        provide: AuthServiceConfig,
        useFactory: provideConfig
      },
      { provide: 'apiKey', useValue: linkedin_id }
    ]
})
export class AuthModuleModule { }
