import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SafeHtmlPipe } from './pipe.safehtml';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ImageCropperComponent } from "ngx-img-cropper";

@NgModule({
  imports:      [ CommonModule, ImageCropperModule  ],
  declarations: [ SafeHtmlPipe, ImageCropperComponent],
  exports:      [ SafeHtmlPipe, CommonModule, FormsModule , ImageCropperModule, ImageCropperComponent]
})
export class SharedModule { }
