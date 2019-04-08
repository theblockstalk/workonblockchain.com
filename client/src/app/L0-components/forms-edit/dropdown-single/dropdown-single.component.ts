import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'L0-dropdown-single',
  templateUrl: './dropdown-single.component.html',
  styleUrls: ['./dropdown-single.component.css']
})
export class DropdownSingleComponent implements OnInit {
  @Input() dropdownList;
  @Input() label;
  constructor() { }

  ngOnInit() {
  }

}
