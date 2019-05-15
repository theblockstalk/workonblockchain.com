import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SafeHtmlPipe } from './pipe.safehtml';
import {ImageCropperModule} from 'ng2-img-cropper/index';

@NgModule({
  imports:      [ CommonModule, ImageCropperModule ],
  declarations: [ SafeHtmlPipe  ],
  exports:      [ SafeHtmlPipe, CommonModule, FormsModule , ImageCropperModule]
})
export class SharedModule { }
