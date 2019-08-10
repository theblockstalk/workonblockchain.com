import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-i-forme-hear-about-wob-other-info',
  templateUrl: './hear-about-wob-other-info.component.html',
  styleUrls: ['./hear-about-wob-other-info.component.css']
})
export class HearAboutWobOtherInfoComponent implements OnInit {
    @Input() otherInfo: string;

  errMsg;

  constructor() { }

  ngOnInit() {
  }

  selfValidate(){
    if(!this.otherInfo){
      this.errMsg = "Please enter other info";
      return false;
    }
    this.errMsg = '';
    return true;
  }

}
