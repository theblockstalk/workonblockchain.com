import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SafeHtmlPipe } from './pipe.safehtml';
import { TextValueComponent } from '../app-v2/L0-components/forms-view/text-value/text-value.component';
import { DashboardComponent } from '../app-v2/L1-items/dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';

@NgModule({
  imports:      [ CommonModule, RouterModule ],
  declarations: [ SafeHtmlPipe, TextValueComponent, DashboardComponent],
  exports:      [ SafeHtmlPipe, CommonModule, FormsModule, TextValueComponent, DashboardComponent ]
})
export class SharedModule { }
