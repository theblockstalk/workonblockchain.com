import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { SocialLoginModule, AuthServiceConfig } from 'angular4-social-login';
import { GoogleLoginProvider } from 'angular4-social-login';
import { LinkedInSdkModule } from 'angular-linkedin-sdk';

import {AuthModuleRoutingModule} from './auth-module-routing.module';

import { CandidateFormComponent } from './candidate-form/candidate-form.component';
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
  declarations: [CandidateFormComponent],
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
