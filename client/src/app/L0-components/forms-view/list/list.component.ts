import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-c-formv-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @Input() label: string;
  @Input() value: Array<string>;
  constructor() { }

  ngOnInit() {
  }

}
