import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SafeHtmlPipe } from './pipe.safehtml';
import { ImageCropperComponent } from "ngx-img-cropper";

@NgModule({
  imports:      [ CommonModule  ],
  declarations: [ SafeHtmlPipe, ImageCropperComponent],
  exports:      [ SafeHtmlPipe, CommonModule, FormsModule , ImageCropperComponent]
})
export class SharedModule { }
