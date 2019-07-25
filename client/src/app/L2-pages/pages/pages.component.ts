import { Component, OnInit, Input, ViewChild  } from '@angular/core';
import { Page } from '../../../constants/interface';

@Component({
  selector: 'app-p-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {
  @Input() pageDoc: Page;

  constructor() { }

  ngOnInit() {
  }

}
