import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-c-nav-wizard',
  templateUrl: './wizards.component.html',
  styleUrls: ['./wizards.component.css']
})
export class WizardsComponent implements OnInit {
  @Input() items = [];
  constructor() { }

  ngOnInit() {

  }

}
