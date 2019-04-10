import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'L0-buttons-others',
  templateUrl: './others.component.html',
  styleUrls: ['./others.component.css']
})
export class OthersComponent implements OnInit {
  @Input() label;
  @Input() buttonClass;
  @Input() buttonType;
  constructor() { }

  ngOnInit() {
  }

}
