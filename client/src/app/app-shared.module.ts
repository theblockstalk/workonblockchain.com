import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SafeHtmlPipe } from './pipe.safehtml';
import { RouterModule } from '@angular/router';
import { MatInputModule, MatSelectModule , MatAutocompleteModule} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ImageCropperModule} from 'ng2-img-cropper/index';
import { CKEditorModule } from 'ng2-ckeditor';
import { TextValueComponent } from './L0-components/forms-view/text-value/text-value.component';
import { DashboardComponent } from './L1-items/dashboard/dashboard.component';
import { DropdownSingleComponent } from './L0-components/forms-edit/dropdown-single/dropdown-single.component';
import { WizardsComponent } from './L0-components/navbars/wizards/wizards.component';
import { AutosuggestComponent } from './L0-components/forms-edit/multiselect/autosuggest/autosuggest.component';
import { AutosugguestValueComponent } from './L1-items/autosugguest-selected-cities-value/autosugguest-value.component';
import { ValidationTextComponent } from './L0-components/forms-edit/validation-text/validation-text.component';
import { HtmlAreaComponent } from './L0-components/forms-edit/html-area/html-area.component';
import { TwitterShareComponent } from './L0-components/buttons/twitter-share/twitter-share.component';
import { SocialLoginComponent } from './L0-components/buttons/social-login/social-login.component';
import { OthersComponent } from './L0-components/buttons/normal/normal.component';
import { AlertsComponent } from './L0-components/alerts/alerts/alerts.component';
import { AutoSuggestCitiesComponent } from './L1-items/auto-suggest-cities/auto-suggest-cities.component';
import { AutosuggestSelectedValueComponent } from './L0-components/forms-edit/badge/badge.component';
import { AutosuggestBadgesComponent } from './L2-groups/autosuggest-badges/autosuggest-badges.component';
import { AutosuggestCitiesSelectedValueComponent } from './L0-components/forms-edit/autosuggest-cities-selected-value/autosuggest-cities-selected-value.component';
import { AutosuggestCitiesBadgesComponent } from './L2-groups/autosuggest-cities-badges/autosuggest-cities-badges.component';
import { AboutComponent } from './L2-groups/candidates/about/about.component';
import { TextInputComponent } from './L0-components/forms-edit/text-input/text-input.component';
import { TextAreaComponent } from './L0-components/forms-edit/text-area/text-area.component';
import { RadioComponent } from './L0-components/forms-edit/radio/radio.component';
import { FirstNameComponent } from './L1-items/users/first-name/first-name.component';
import { WorkHistoryComponent } from './L1-items/work-history/work-history.component';
import { CandidateEditComponent } from './L2-pages/candidate-edit/candidate-edit.component';
import { CheckboxComponent } from './L0-components/forms-edit/checkbox/checkbox.component';
import { BioComponent } from './L1-items/users/bio/bio.component';
import { ContactNumberComponent } from './L1-items/users/contact-number/contact-number.component';
import { EmailAddressComponent } from './L1-items/users/email-address/email-address.component';
import { GithubUrlComponent } from './L1-items/candidate/github-url/github-url.component';
import { LastNameComponent } from './L1-items/users/last-name/last-name.component';
import { LinkedinUrlComponent } from './L1-items/candidate/linkedin-url/linkedin-url.component';
import { MediumUrlComponent } from './L1-items/candidate/medium-url/medium-url.component';
import { NationalityComponent } from './L1-items/users/nationality/nationality.component';
import { StackexchangeUrlComponent } from './L1-items/candidate/stackexchange-url/stackexchange-url.component';
import { DropdownMultiselectComponent } from './L0-components/forms-edit/dropdown-multiple/dropdown-multiple.component';
import { PersonalWebsiteUrlComponent } from './L1-items/candidate/personal-website-url/personal-website-url.component';
import { StackoverflowUrlComponent } from './L1-items/candidate/stackoverflow-url/stackoverflow-url.component';
import { ProfilePicComponent } from './L1-items/users/profile-pic/profile-pic.component';
import { CountryComponent } from './L1-items/users/country/country.component';
import { CityComponent } from './L1-items/users/city/city.component';
import { CurrentSalaryComponent } from './L1-items/candidate/current-salary/current-salary.component';
import { ToggleSwitchComponent } from './L0-components/forms-edit/toggle-switch/toggle-switch.component';
import { DropdownAutosuggestComponent} from './L0-components/forms-edit/dropdown-autosuggest/dropdown-autosuggest.component';
import { TimeSelectComponent } from './L0-components/forms-edit/time-select/time-select.component';
import { DateSelectComponent } from './L0-components/forms-edit/date-select/date-select.component';
import { ButtonGroupComponent } from './L0-components/forms-edit/button-group/button-group.component';

@NgModule({
  imports: [
    CommonModule, FormsModule, CKEditorModule, ReactiveFormsModule, RouterModule, MatInputModule, MatSelectModule,
    MatAutocompleteModule, ImageCropperModule
  ],
  declarations: [
    SafeHtmlPipe, TextValueComponent, DashboardComponent, ValidationTextComponent, HtmlAreaComponent, TwitterShareComponent,
    DropdownSingleComponent, WizardsComponent, AutosuggestComponent, AutosugguestValueComponent, SocialLoginComponent,
    OthersComponent, AlertsComponent, AutoSuggestCitiesComponent, AutosuggestSelectedValueComponent, AutosuggestBadgesComponent,
    AutosuggestCitiesSelectedValueComponent, AutosuggestCitiesBadgesComponent, AboutComponent, TextInputComponent,
    TextAreaComponent, RadioComponent, FirstNameComponent, WorkHistoryComponent, CandidateEditComponent,
    CheckboxComponent, BioComponent, ContactNumberComponent, EmailAddressComponent, GithubUrlComponent, LastNameComponent,
    LinkedinUrlComponent, MediumUrlComponent, NationalityComponent, StackexchangeUrlComponent, DropdownMultiselectComponent,
    PersonalWebsiteUrlComponent, StackoverflowUrlComponent, ProfilePicComponent, CountryComponent, CityComponent,
    CurrentSalaryComponent, ToggleSwitchComponent, DropdownAutosuggestComponent, TimeSelectComponent, DateSelectComponent,
    ButtonGroupComponent
  ],
  exports: [
    SafeHtmlPipe, FormsModule, CKEditorModule, ReactiveFormsModule, ImageCropperModule, MatInputModule, MatSelectModule,
    MatAutocompleteModule, CommonModule, TextValueComponent, DashboardComponent, DropdownSingleComponent, WizardsComponent,
    AutosuggestComponent, AutosugguestValueComponent, ValidationTextComponent, HtmlAreaComponent, TwitterShareComponent,
    SocialLoginComponent, OthersComponent, AlertsComponent, AutoSuggestCitiesComponent, AutosuggestSelectedValueComponent,
    AutosuggestBadgesComponent, AutosuggestCitiesSelectedValueComponent, AutosuggestCitiesBadgesComponent, AboutComponent,
    TextInputComponent, TextAreaComponent, RadioComponent, FirstNameComponent, WorkHistoryComponent, CandidateEditComponent,
    CheckboxComponent, BioComponent, ContactNumberComponent, EmailAddressComponent, GithubUrlComponent, LastNameComponent,
    LinkedinUrlComponent, MediumUrlComponent, NationalityComponent, StackexchangeUrlComponent, DropdownMultiselectComponent,
    PersonalWebsiteUrlComponent, StackoverflowUrlComponent, ProfilePicComponent, CountryComponent, CityComponent,
    CurrentSalaryComponent, ToggleSwitchComponent, DropdownAutosuggestComponent, TimeSelectComponent, DateSelectComponent,
    ButtonGroupComponent
  ]
})
export class SharedModule { }
