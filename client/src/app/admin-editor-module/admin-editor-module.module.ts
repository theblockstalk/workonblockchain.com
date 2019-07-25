import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ScriptService} from '../scripts/script.service';
import { SharedModule } from '../app-shared.module';

import { AdminEditorModuleRoutingModule } from './admin-editor-module-routing.module';

import { EmailTemplatesComponent } from './email-templates/email-templates.component';

@NgModule({
  imports: [
    CommonModule,
    AdminEditorModuleRoutingModule,
    SharedModule
  ],
  declarations: [
    EmailTemplatesComponent
  ],
  providers : [ScriptService]
})
export class AdminEditorModuleModule {
  constructor(private scriptService : ScriptService) {
    this.scriptService.load('ckeditor').then(data => {
    }).catch(error => console.log(error));
  }
}
