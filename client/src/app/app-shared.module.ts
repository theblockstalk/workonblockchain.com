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
import { AutosugguestValueComponent } from './L1-items/autosugguest-selected-cities-value/autosugguest-value.component';
import { ValidationTextComponent } from './L0-components/forms-edit/validation-text/validation-text.component';
import { HtmlAreaComponent } from './L0-components/forms-edit/html-area/html-area.component';
import { TwitterShareComponent } from './L0-components/buttons/twitter-share/twitter-share.component';
import { SocialLoginComponent } from './L0-components/buttons/social-login/social-login.component';
import { OthersComponent } from './L0-components/buttons/others/others.component';
import { AlertsComponent } from './L0-components/alerts/alerts/alerts.component';
import { AutoSuggestCitiesComponent } from './L1-items/auto-suggest-cities/auto-suggest-cities.component';
import { AutosuggestSelectedValueComponent } from './L0-components/forms-edit/autosuggest-selected-value/autosuggest-selected-value.component';
import { AutosuggestBadgesComponent } from './L2-groups/autosuggest-badges/autosuggest-badges.component';
import { AutosuggestCitiesSelectedValueComponent } from './L0-components/forms-edit/autosuggest-cities-selected-value/autosuggest-cities-selected-value.component';
import { AutosuggestCitiesBadgesComponent } from './L2-groups/autosuggest-cities-badges/autosuggest-cities-badges.component';
import { AboutComponent } from './L2-groups/candidates/about/about.component';
import { TextInputComponent } from './L0-components/forms-edit/text-input/text-input.component';
import { TextAreaComponent } from './L0-components/forms-edit/text-area/text-area.component';
import { RadioComponent } from './L0-components/forms-edit/radio/radio.component';
import { FirstNameComponent } from './L1-items/first-name/first-name.component';
import { WorkHistoryComponent } from './L1-items/work-history/work-history.component';
import { CandidateEditComponent } from './L2-pages/candidate-edit/candidate-edit.component';
import { CheckboxComponent } from './L0-components/forms-edit/checkbox/checkbox.component';
@NgModule({
  imports:      [ CommonModule, FormsModule, CKEditorModule, ReactiveFormsModule, RouterModule, MatInputModule, MatSelectModule,
                  MatAutocompleteModule ],
  declarations: [ SafeHtmlPipe, TextValueComponent, DashboardComponent, ValidationTextComponent, HtmlAreaComponent, TwitterShareComponent,
                  DropdownSingleComponent, WizardsComponent, AutosuggestComponent, AutosugguestValueComponent, SocialLoginComponent,
                  OthersComponent, AlertsComponent, AutoSuggestCitiesComponent, AutosuggestSelectedValueComponent, AutosuggestBadgesComponent,
                  AutosuggestCitiesSelectedValueComponent, AutosuggestCitiesBadgesComponent, AboutComponent, TextInputComponent,
                  TextAreaComponent, RadioComponent, FirstNameComponent, WorkHistoryComponent, CandidateEditComponent, CheckboxComponent],
  exports:      [ SafeHtmlPipe, FormsModule, CKEditorModule, ReactiveFormsModule, MatInputModule, MatSelectModule, MatAutocompleteModule, CommonModule,
                  TextValueComponent, DashboardComponent, DropdownSingleComponent, WizardsComponent, AutosuggestComponent,
                  AutosugguestValueComponent, ValidationTextComponent, HtmlAreaComponent, TwitterShareComponent, SocialLoginComponent,
                  OthersComponent, AlertsComponent, AutoSuggestCitiesComponent, AutosuggestSelectedValueComponent, AutosuggestBadgesComponent,
                  AutosuggestCitiesSelectedValueComponent, AutosuggestCitiesBadgesComponent, AboutComponent, TextInputComponent,
                  TextAreaComponent, RadioComponent, FirstNameComponent, WorkHistoryComponent, CandidateEditComponent, CheckboxComponent]
})
export class SharedModule { }
