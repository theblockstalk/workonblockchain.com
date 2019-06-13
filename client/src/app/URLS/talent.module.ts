import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../app-shared.module';

import { TalentRoutingModule } from './talent-routing.module';

import { ProfileResolver } from '../incomplete-profile.resolver';
import { EditCandidateProfileComponent } from './users/talent/edit/edit-candidate-profile.component';
import { AdminTalentEditComponent } from './admins/talent/edit/admin-talent-edit.component';
import { PagesEditComponent } from './admins/pages/pages-edit.component';

@NgModule({
  imports: [
    CommonModule,
    TalentRoutingModule,
    SharedModule,
  ],
  declarations: [
    EditCandidateProfileComponent,
    AdminTalentEditComponent,
    PagesEditComponent
  ],
  providers: [
    ProfileResolver
  ]
})
export class TalentModule { }
