import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WelcomePopupEditorComponent } from './welcome-popup-editor/welcome-popup-editor.component';
import { ChatPopupEditorComponent } from './chat-popup-editor/chat-popup-editor.component';
import { PrivacyEditorComponent } from './privacy-editor/privacy-editor.component';
import { AdminFaqEditorComponent } from './admin-faq-editor/admin-faq-editor.component';
import { AdminTermsConditionEditorComponent } from './admin-terms-condition-editor/admin-terms-condition-editor.component';

const routes: Routes = [
  {path : 'admin-welcome-msg-editor' , component: WelcomePopupEditorComponent},
  {path: 'admin-chat-popup-editor', component: ChatPopupEditorComponent},
  {path : 'admin-privacy-notice-editor' , component: PrivacyEditorComponent},
  {path : 'admin-faq-editor' , component: AdminFaqEditorComponent},
  {path : 'admin-terms-and-condition-editor' , component: AdminTermsConditionEditorComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminEditorModuleRoutingModule {
}
