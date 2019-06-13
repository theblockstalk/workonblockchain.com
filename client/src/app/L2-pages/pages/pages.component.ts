import { Component, OnInit, Input, ViewChild  } from '@angular/core';

@Component({
  selector: 'app-p-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {
  @Input() pageDoc: object;

  constructor() { }

  ngOnInit() {
  }

}
