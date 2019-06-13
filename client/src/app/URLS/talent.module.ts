import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../app-shared.module';

import { TalentRoutingModule } from './talent-routing.module';

import { ProfileResolver } from '../incomplete-profile.resolver';
import { EditCandidateProfileComponent } from './users/talent/edit/edit-candidate-profile.component';
import { AdminTalentEditComponent } from './admins/talent/edit/admin-talent-edit.component';
import { PagesComponent } from './admins/pages/pages.component';

@NgModule({
  imports: [
    CommonModule,
    TalentRoutingModule,
    SharedModule,
  ],
  declarations: [
    EditCandidateProfileComponent,
    AdminTalentEditComponent,
    PagesComponent
  ],
  providers: [
    ProfileResolver
  ]
})
export class TalentModule { }
