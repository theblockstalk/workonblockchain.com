import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SafeHtmlPipe } from './pipe.safehtml';
import { RouterModule } from '@angular/router';
import { MatInputModule, MatSelectModule , MatAutocompleteModule} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from 'ng2-ckeditor';
import { TextValueComponent } from './L0-components/forms-view/text-value/text-value.component';
import { DashboardComponent } from './L1-items/dashboard/dashboard.component';
import { DropdownSingleComponent } from './L0-components/forms-edit/dropdown-single/dropdown-single.component';
import { WizardsComponent } from './L0-components/navbars/wizards/wizards.component';
import { AutosuggestComponent } from './L0-components/forms-edit/dropdown-multiple/autosuggest/autosuggest.component';
import { AutosugguestValueComponent } from './L0-components/forms-view/autosugguest-value/autosugguest-value.component';
import { ValidationTextComponent } from './L0-components/forms-view/validation-text/validation-text.component';
import { HtmlAreaComponent } from './L0-components/forms-edit/html-area/html-area.component';
import { TwitterShareComponent } from './L0-components/buttons/twitter-share/twitter-share.component';
import { SocialLoginComponent } from './L0-components/buttons/social-login/social-login.component';
import { OthersComponent } from './L0-components/buttons/others/others.component';
import { AlertsComponent } from './L0-components/alerts/alerts/alerts.component';

@NgModule({
  imports:      [ CommonModule, FormsModule, CKEditorModule, ReactiveFormsModule, RouterModule, MatInputModule, MatSelectModule, MatAutocompleteModule ],
  declarations: [ SafeHtmlPipe, TextValueComponent, DashboardComponent, ValidationTextComponent, HtmlAreaComponent, TwitterShareComponent,
                  DropdownSingleComponent, WizardsComponent, AutosuggestComponent, AutosugguestValueComponent, SocialLoginComponent,
                  OthersComponent, AlertsComponent],
  exports:      [ SafeHtmlPipe, FormsModule, CKEditorModule, ReactiveFormsModule, MatInputModule, MatSelectModule, MatAutocompleteModule, CommonModule,
                  TextValueComponent, DashboardComponent, DropdownSingleComponent, WizardsComponent, AutosuggestComponent,
                  AutosugguestValueComponent, ValidationTextComponent, HtmlAreaComponent, TwitterShareComponent, SocialLoginComponent,
                  OthersComponent, AlertsComponent]
})
export class SharedModule { }
