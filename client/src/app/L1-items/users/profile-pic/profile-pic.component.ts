import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';
declare var $:any;

@Component({
  selector: 'app-i-forme-profile-pic',
  templateUrl: './profile-pic.component.html',
  styleUrls: ['./profile-pic.component.css']
})
export class ProfilePicComponent implements OnInit {
  @Input() image: string;
  imageName;
  cropperSettings: CropperSettings;
  imageCropData:any;
  @ViewChild('cropper', undefined) cropper: ImageCropperComponent;
  constructor() { }

  ngOnInit() {
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.noFileInput = true;
    this.cropperSettings.width = 200;
    this.cropperSettings.height = 200;
    this.cropperSettings.minWidth = 180;
    this.cropperSettings.minHeight = 180;
    this.cropperSettings.croppedWidth = 200;
    this.cropperSettings.croppedHeight = 200;
    this.cropperSettings.canvasWidth = 300;
    this.cropperSettings.canvasHeight = 300;
    this.cropperSettings.rounded = true;
    this.cropperSettings.cropperDrawSettings.strokeWidth = 2;
    this.cropperSettings.cropperDrawSettings.strokeColor = 'black';
    this.imageCropData = {};
  }

  fileChangeListener($event) {
    const image:any = new Image();
    const file:File = $event.target.files[0];
    const myReader:FileReader = new FileReader();
    const that = this;
    myReader.onloadend = function (loadEvent:any) {
      image.src = loadEvent.target.result;
      that.cropper.setImage(image);
    };
    this.imageName = file.name;
    myReader.readAsDataURL(file);
  }


  dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, {type:mime});
  }

  imageCropped(key) {
    if(key === 'cancel') {
      this.imageCropData = {};
    }
    $('#imageModal').modal('hide');
  }

}
