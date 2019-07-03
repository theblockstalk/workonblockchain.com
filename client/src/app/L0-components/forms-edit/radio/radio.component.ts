import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-c-forme-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.css']
})
export class RadioComponent implements OnInit {
  @Input() label: string;
  @Input() value: string;
  @Input() options: Array<string>;
  @Input() errorMsg: string;
  @Input() id: string; //used to differentiate b/w radio buttons on same page
  @Output() selectedOption: EventEmitter<string> = new EventEmitter<string>();
  constructor() { }

  ngOnInit() {
  }

  selectedItem(event) {
    this.selectedOption.emit(event.target.value);
  }

  selectedValue(item) {
    if(this.value === item) return true;
    return false;
  }

}
