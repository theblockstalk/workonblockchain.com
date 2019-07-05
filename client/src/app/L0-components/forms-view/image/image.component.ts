import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-c-formv-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {
  @Input() image: string; //name or link of image to display

  constructor() { }

  ngOnInit() {
  }

}
