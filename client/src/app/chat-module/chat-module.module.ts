import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat/chat.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from 'ng2-ckeditor';
import { MyDatePickerModule } from 'mydatepicker';
import { SharedModule } from '../app-shared.module';
import {ScriptService} from '../scripts/script.service';

import { ChatModuleRoutingModule } from './chat-module-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ChatModuleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    MyDatePickerModule,
    SharedModule
  ],
  declarations: [
    ChatComponent
  ],
  providers : [ScriptService]
})
export class ChatModuleModule {
  constructor(private scriptService : ScriptService) {
    this.scriptService.load('ckeditor').then(data => {
      //console.log('script loaded ', data);
    }).catch(error => console.log(error));
  }
}
