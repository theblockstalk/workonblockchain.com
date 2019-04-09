import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SafeHtmlPipe } from './pipe.safehtml';
import { TextValueComponent } from './L0-components/forms-view/text-value/text-value.component';
import { DashboardComponent } from './L1-items/dashboard/dashboard.component';
import { DropdownSingleComponent } from './L0-components/forms-edit/dropdown-single/dropdown-single.component';
import { WizardsComponent } from './L0-components/navbars/wizards/wizards.component';

import { RouterModule } from '@angular/router';

@NgModule({
  imports:      [ CommonModule, RouterModule ],
  declarations: [ SafeHtmlPipe, TextValueComponent, DashboardComponent, DropdownSingleComponent, WizardsComponent],
  exports:      [ SafeHtmlPipe, CommonModule, FormsModule, TextValueComponent, DashboardComponent, DropdownSingleComponent, WizardsComponent ]
})
export class SharedModule { }
