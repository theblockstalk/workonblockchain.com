import { Component, OnInit } from '@angular/core';
import {constants} from '../../../constants/constants';

@Component({
  selector: 'app-admin-timeframe-search',
  templateUrl: './admin-timeframe-search.component.html',
  styleUrls: ['./admin-timeframe-search.component.css']
})
export class AdminTimeframeSearchComponent implements OnInit {

  timeframe_list = constants.timeframe_list;
  timeframe = 5;timeframe_log;
  constructor() { }

  ngOnInit() {
    console.log('in AdminTimeframeSearchComponent');
  }
  selected_timeframe(){
    console.log('changed');
    console.log(this.timeframe);
  }

}
