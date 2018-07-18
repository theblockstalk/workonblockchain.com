import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { CandidateFormComponent } from './candidate-form/candidate-form.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule,ReactiveFormsModule,FormGroup, FormArray }    from '@angular/forms';
import { UserService } from './user.service';
import { AboutComponent } from './about/about.component';
//import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { environment } from '../environments/environment';
import { JobComponent } from './job/job.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ResumeComponent } from './resume/resume.component';
import { ExperienceComponent } from './experience/experience.component';
import { FinalComponent } from './final/final.component';
import { DatePipe } from '@angular/common';
import { SocialLoginModule, AuthServiceConfig } from "angular4-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angular4-social-login";
import { LinkedInSdkModule } from 'angular-linkedin-sdk';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { DataService } from "./data.service";
import { EmployerSignupComponent } from './employer-signup/employer-signup.component';
import { ReferralComponent } from './referral/referral.component';
import { ReferComponent } from './refer/refer.component';
import { ChatComponent } from './chat/chat.component';
import { TermsWizardComponent } from './terms-wizard/terms-wizard.component';
import { AboutCompanyComponent } from './about-company/about-company.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { CandidateProfileComponent } from './candidate-profile/candidate-profile.component';
import { EditCandidateProfileComponent } from './edit-candidate-profile/edit-candidate-profile.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { EditCompanyProfileComponent } from './edit-company-profile/edit-company-profile.component';
import { CompanySearchComponent } from './company-search/company-search.component';
import { Select2Module } from 'ng2-select2';
import {NgxPaginationModule} from 'ngx-pagination';
import { CandidateDetailComponent } from './candidate-detail/candidate-detail.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminCandidateSearchComponent } from './admin-candidate-search/admin-candidate-search.component';
import { AdminCandidateDetailComponent } from './admin-candidate-detail/admin-candidate-detail.component';
import { AdminDisplayChatComponent } from './admin-display-chat/admin-display-chat.component';
import { AdminCompanySearchComponent } from './admin-company-search/admin-company-search.component';
import { AdminCompanyDetailComponent } from './admin-company-detail/admin-company-detail.component';
import { BuildingCustomPageComponent } from './building-custom-page/building-custom-page.component';
import { CandidateTermsComponent } from './candidate-terms/candidate-terms.component'; 
import { NgxEditorModule } from 'ngx-editor';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { PrivacyEditorComponent } from './privacy-editor/privacy-editor.component';
import { SafeHtmlPipe } from "./pipe.safehtml";
import { CKEditorModule } from 'ng2-ckeditor';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { AdminFaqEditorComponent } from './admin-faq-editor/admin-faq-editor.component';
import { FaqComponent } from './faq/faq.component';
import { AdminTermsConditionEditorComponent } from './admin-terms-condition-editor/admin-terms-condition-editor.component';
import { TermsAndConditionComponent } from './terms-and-condition/terms-and-condition.component';
import { AccountSettingComponent } from './account-setting/account-setting.component';
import { CookieService } from 'ngx-cookie-service';
import { ScrollToModule } from 'ng2-scroll-to-el';

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    //provider: new GoogleLoginProvider("507151802069-rbqn1iqupcbr7t7ge50nup74fu0td5g0.apps.googleusercontent.com")
        provider: new GoogleLoginProvider("507151802069-sedtrf34188eet5oo4adrm60vlsruo5r.apps.googleusercontent.com")
  }
]);

export function provideConfig() {
  return config;
}

const appRoutes: Routes = [
    { path: 'signup', component: CandidateFormComponent},
    { path: 'about', component: AboutComponent},
    { path: 'job', component: JobComponent},
    { path: 'login', component: LoginComponent},
    { path: 'home', component: HomeComponent},
    { path: '', component: HomeComponent},
     { path: 'terms-and-condition', component: CandidateTermsComponent},
    { path: 'resume', component: ResumeComponent},
    { path: 'experience', component: ExperienceComponent},
    { path: 'candidate_profile', component: CandidateProfileComponent},
    { path: 'verify_email', component: VerifyEmailComponent},
    { path: 'forgot_password', component: ForgotPasswordComponent},
    { path: 'reset_password', component: ResetPasswordComponent},
    { path: 'referral', component: ReferralComponent},
    { path: 'refer', component: CandidateFormComponent},
    { path: 'chat', component: ChatComponent},
    // otherwise redirect to home
    { path: 'company_wizard', component: TermsWizardComponent},
    {path : 'about_comp' , component: AboutCompanyComponent},
    {path : 'company_profile' , component:CompanyProfileComponent},
    {path : 'not_found' , component:NotFoundComponent},
    {path : 'edit_profile' , component: EditCandidateProfileComponent},
    {path : 'edit_company_profile' , component: EditCompanyProfileComponent},
    {path : 'candidate-search' , component: CompanySearchComponent},
    {path : 'candidate-detail' , component: CandidateDetailComponent},
    //////admin urls////////////////////////////////////////////////////////////////////////
    {path : 'admin-dashboard' , component: AdminDashboardComponent},
    {path : 'admin-candidate-search' , component: AdminCandidateSearchComponent},
    {path : 'admin-candidate-detail' , component: AdminCandidateDetailComponent},
    {path : 'admin-display-chat' , component: AdminDisplayChatComponent},
    {path : 'admin-company-search' , component: AdminCompanySearchComponent},
    {path : 'admin-company-detail' , component: AdminCompanyDetailComponent},
    {path : 'admin-build-page' , component: BuildingCustomPageComponent},
	{path : 'admin-privacy-policy-editor' , component: PrivacyEditorComponent},
    {path : 'admin-faq-editor' , component: AdminFaqEditorComponent},
    {path : 'admin-terms-and-condition-editor' , component: AdminTermsConditionEditorComponent},
    {path : 'privacy-policy' , component: PrivacyPolicyComponent},
    {path : 'term-and-conditions' , component: TermsAndConditionComponent},
    {path : 'faq' , component: FaqComponent},
    {path : 'account-setting' , component: AccountSettingComponent},
    { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent,
    CandidateFormComponent,
    AboutComponent,
   // FileSelectDirective,
    JobComponent,
    LoginComponent,
    HomeComponent,
    ResumeComponent,
    ExperienceComponent,
    FinalComponent,
    VerifyEmailComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    EmployerSignupComponent,
    ReferralComponent,
    ChatComponent,
    ReferComponent,
    TermsWizardComponent,
    AboutCompanyComponent,
    CompanyProfileComponent,
    NotFoundComponent,
    CandidateProfileComponent,
    EditCandidateProfileComponent,
    HeaderComponent,
    FooterComponent,
    EditCompanyProfileComponent,
    CompanySearchComponent,
    CandidateDetailComponent,
    AdminDashboardComponent,
    AdminCandidateSearchComponent,
    AdminCandidateDetailComponent,
    AdminDisplayChatComponent,
    AdminCompanySearchComponent,
    AdminCompanyDetailComponent,
    BuildingCustomPageComponent,
    CandidateTermsComponent,
    PrivacyEditorComponent,
    SafeHtmlPipe,
    PrivacyPolicyComponent,
    AdminFaqEditorComponent,
    FaqComponent,
    AdminTermsConditionEditorComponent,
    TermsAndConditionComponent,

    AccountSettingComponent,
	

  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    LinkedInSdkModule,
    SocialLoginModule,
    HttpClientModule,
    Select2Module,
    NgxPaginationModule,
    NgxEditorModule,
    TooltipModule.forRoot(),
    AngularFontAwesomeModule,
    CKEditorModule,
    RouterModule.forRoot(appRoutes),
	ScrollToModule.forRoot()
  ],
  providers: 
  [
    UserService,DatePipe,DataService,CookieService,
  {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    },
    { provide: 'apiKey', useValue: '78axuc5uh894iq' } //useValue : '78lfupn2m88e4u'
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


