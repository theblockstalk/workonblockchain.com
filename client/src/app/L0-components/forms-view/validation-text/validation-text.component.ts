import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'L0-validation-text',
  templateUrl: './validation-text.component.html',
  styleUrls: ['./validation-text.component.css']
})
export class ValidationTextComponent implements OnInit {
  @Input() errorMsg;
  constructor() { }

  ngOnInit() {
  }

}
