import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-c-forme-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.css']
})
export class RadioComponent implements OnInit {
  @Input() label: string;
  @Input() value: string;
  @Input() options: object;
  constructor() { }

  ngOnInit() {
  }

}
