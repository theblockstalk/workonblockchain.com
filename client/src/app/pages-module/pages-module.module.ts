import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../app-shared.module';
import { PagesModuleRoutingModule } from './pages-module-routing.module';

import { ContactUsComponent } from './contact-us/contact-us.component';
import { FeesComponent } from './fees/fees.component';

@NgModule({
  imports: [
    CommonModule,
    PagesModuleRoutingModule,
    SharedModule
  ],
  declarations: [
    ContactUsComponent,
    FeesComponent,
  ]
})
export class PagesModuleModule { }
