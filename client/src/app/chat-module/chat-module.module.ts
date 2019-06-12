import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat/chat.component';
import { MyDatePickerModule } from 'mydatepicker';
import { SharedModule } from '../app-shared.module';
import {ScriptService} from '../scripts/script.service';

import { ChatModuleRoutingModule } from './chat-module-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ChatModuleRoutingModule,
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
    }).catch(error => console.log(error));
  }
}
