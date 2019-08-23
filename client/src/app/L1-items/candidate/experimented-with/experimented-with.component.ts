import { Component, OnInit, Input } from '@angular/core';
import { constants } from '../../../../constants/constants';

@Component({
  selector: 'app-i-forme-experimented-with',
  templateUrl: './experimented-with.component.html',
  styleUrls: ['./experimented-with.component.css']
})
export class ExperimentedWithComponent implements OnInit {
  @Input() experimented_platforms: Array<string>;
  @Input() description_experimented_platforms: string;
  experimented = constants.experimented;
  errMsg;
  constructor() { }

  ngOnInit() {
    this.experimented.sort(function(a, b){
      if(a.name < b.name) { return -1; }
      if(a.name > b.name) { return 1; }
      return 0;
    })
  }

  selfValidate() {
    if(this.experimented_platforms && this.experimented_platforms.length > 0) {
      if(this.description_experimented_platforms && this.description_experimented_platforms.length < 40) {
        this.errMsg = 'Please enter minimum 40 characters description';
        return false;
      }
      delete this.errMsg;
      return true;
    }
    return true;
  }

}
