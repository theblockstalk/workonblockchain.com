import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-c-forme-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css']
})
export class CheckboxComponent implements OnInit {
  @Input() label: string;
  @Input() options: object;
  @Input() value: string;
  constructor() { }

  ngOnInit() {
  }

}
