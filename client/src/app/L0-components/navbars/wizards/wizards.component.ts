import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-wizards',
  templateUrl: './wizards.component.html',
  styleUrls: ['./wizards.component.css']
})
export class WizardsComponent implements OnInit {
  @Input() routeLink;
  @Input() activeClass;
  @Input() linkText;
  @Input() disableClass;
  constructor() { }

  ngOnInit() {

  }

}
