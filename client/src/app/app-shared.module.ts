import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SafeHtmlPipe } from './pipe.safehtml';
import { TextValueComponent } from '../app-v2/0-component/text-value/text-value.component';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ SafeHtmlPipe, TextValueComponent],
  exports:      [ SafeHtmlPipe, CommonModule, FormsModule, TextValueComponent ]
})
export class SharedModule { }
