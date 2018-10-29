import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat/chat.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from 'ng2-ckeditor';
import { MyDatePickerModule } from 'mydatepicker';

import { ChatModuleRoutingModule } from './chat-module-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ChatModuleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    MyDatePickerModule
  ],
  declarations: [
    ChatComponent
  ]
})
export class ChatModuleModule { }
