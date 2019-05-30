import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-i-forme-why-work',
  templateUrl: './why-work.component.html',
  styleUrls: ['./why-work.component.css']
})
export class WhyWorkComponent implements OnInit {
  @Input() why_work: string;
  work_description = '<ul><li> Let companies know what excites you about this space. </li><li> This is the first field that a company sees! </li></ul>';
  errMsg;
  constructor() { }

  ngOnInit() {
  }

  selfValidate() {
    if(!this.why_work) {
      this.errMsg = 'Please enter why work';
      return false;
    }
    delete this.errMsg;
    return true;
  }

}
