import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../app-shared.module';

import { PagesRoutingModule } from './pages-routing.module';

import { PagesComponent } from './pages/pages.component';

@NgModule({
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
  ],
  declarations: [
    PagesComponent
  ],
  providers: [
  ]
})
export class PagesModule { }
