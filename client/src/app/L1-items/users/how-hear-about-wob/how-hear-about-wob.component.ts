import {Component, OnInit, Input} from '@angular/core';
import { constants } from '../../../../constants/constants';

@Component({
  selector: 'app-i-forme-how-hear-about-wob',
  templateUrl: './how-hear-about-wob.component.html',
  styleUrls: ['./how-hear-about-wob.component.css']
})
export class HowHearAboutWobComponent implements OnInit {
  @Input() howHearAboutWOB: string;

  how_hear_about_wob_options = constants.hear_about_wob;
  hear_about_wob_ErrMsg;

  constructor() { }

  ngOnInit() {
  }

  selfValidate(){
    if(!this.howHearAboutWOB){
      this.hear_about_wob_ErrMsg = "Please choose an option";
      return false;
    }
    this.hear_about_wob_ErrMsg = '';
    return true;
  }

}
