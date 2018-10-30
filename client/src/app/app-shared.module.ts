import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SafeHtmlPipe } from './pipe.safehtml';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ SafeHtmlPipe],
  exports:      [ SafeHtmlPipe, CommonModule, FormsModule ]
})
export class SharedModule { }
