import { Component, OnInit, Input } from '@angular/core';
import { WizardObject } from '../../../../constants/interface';

@Component({
  selector: 'app-c-nav-wizard',
  templateUrl: './wizards.component.html',
  styleUrls: ['./wizards.component.css']
})
export class WizardsComponent implements OnInit {
  @Input() items: WizardObject[];
  constructor() { }

  ngOnInit() {

  }

}
