import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../app-shared.module';

import { TalentRoutingModule } from './talent-routing.module';

import { ProfileResolver } from '../incomplete-profile.resolver';
import { AdminTalentEditComponent } from './admins/talent/edit/admin-talent-edit.component';
import { PagesEditComponent } from './admins/pages/pages-edit.component';
import { AdminTalentViewComponent } from './admins/talent/view/admin-talent-view.component';

@NgModule({
  imports: [
    CommonModule,
    TalentRoutingModule,
    SharedModule,
  ],
  declarations: [
    AdminTalentEditComponent,
    PagesEditComponent,
    AdminTalentViewComponent
  ],
  providers: [
    ProfileResolver
  ]
})
export class TalentModule { }
