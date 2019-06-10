import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-c-forme-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class FileComponent implements OnInit {
  @Input() accepts: string; //'file', 'image'
  @Input() errorMsg: string;
  @Output() selectedFile: EventEmitter<object> = new EventEmitter<object>();
  constructor() { }

  ngOnInit() {
  }

}
