import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'L0-navbars-wizards',
  templateUrl: './wizards.component.html',
  styleUrls: ['./wizards.component.css']
})
export class WizardsComponent implements OnInit {
  @Input() wizardMenu = [];
  constructor() { }

  ngOnInit() {

  }

}
