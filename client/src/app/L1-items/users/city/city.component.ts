import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-i-forme-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {
  @Input() city: string;
  errMsg;
  constructor() { }

  ngOnInit() {
  }

  selfValidate() {
    if(!this.city) {
      this.errMsg = "Please enter city";
      return false;
    }
    delete this.errMsg;
    return true;
  }

}
