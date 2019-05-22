import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-c-forme-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.css']
})
export class RadioComponent implements OnInit {
  @Input() label: string;
  @Input() value: string;
  @Input() options: object;
  @Input() errorMsg: string;
  @Output() selectedRadioValues: EventEmitter<string> = new EventEmitter<string>();
  selectedOptions = [];
  constructor() { }

  ngOnInit() {
  }

  selectedOptions(event)
  {
    if(event.target.checked)
    {
      this.selectedOptions.push(event.target.value);
    }
    else{
      let updateItem = this.selectedOptions.find(x => x === event.target.value);
      let index = this.selectedOptions.indexOf(updateItem);
      this.selectedOptions.splice(index, 1);
    }
    this.selectedRadioValues.emit(this.selectedOptions);
  }


}
