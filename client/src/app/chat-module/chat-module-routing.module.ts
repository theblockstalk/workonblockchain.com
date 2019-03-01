import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import {VerifyEmailMiddleware} from '../../app/auth-module/verify-email-middleware';

const routes: Routes = [
  { path: 'chat', component: ChatComponent, canActivate: [VerifyEmailMiddleware]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatModuleRoutingModule { }
