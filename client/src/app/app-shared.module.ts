import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SafeHtmlPipe } from './pipe.safehtml';
import { MatInputModule, MatSelectModule , MatAutocompleteModule} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextValueComponent } from './L0-components/forms-view/text-value/text-value.component';
import { DashboardComponent } from './L1-items/dashboard/dashboard.component';
import { DropdownSingleComponent } from './L0-components/forms-edit/dropdown-single/dropdown-single.component';
import { WizardsComponent } from './L0-components/navbars/wizards/wizards.component';
import { AutosuggestComponent } from './L0-components/forms-edit/dropdown-multiple/autosuggest/autosuggest.component';
import { AutosugguestValueComponent } from './L0-components/forms-view/autosugguest-value/autosugguest-value.component';
import { ValidationTextComponent } from './L0-components/forms-view/validation-text/validation-text.component';

import { RouterModule } from '@angular/router';

@NgModule({
  imports:      [ CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MatInputModule, MatSelectModule, MatAutocompleteModule ],
  declarations: [ SafeHtmlPipe, TextValueComponent, DashboardComponent, ValidationTextComponent,
                  DropdownSingleComponent, WizardsComponent, AutosuggestComponent, AutosugguestValueComponent],
  exports:      [ SafeHtmlPipe, FormsModule, ReactiveFormsModule, MatInputModule, MatSelectModule, MatAutocompleteModule, CommonModule,
                  TextValueComponent, DashboardComponent, DropdownSingleComponent, WizardsComponent, AutosuggestComponent,
                  AutosugguestValueComponent, ValidationTextComponent ]
})
export class SharedModule { }
