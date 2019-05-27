import { Component, OnInit, Input } from '@angular/core';
import { constants } from '../../../../constants/constants';

@Component({
  selector: 'app-i-forme-year-of-experience',
  templateUrl: './year-of-experience.component.html',
  styleUrls: ['./year-of-experience.component.css']
})
export class YearOfExperienceComponent implements OnInit {
  @Input() platforms = [];
  @Input() errorMsg: string;
  experienceYears = constants.experienceYears;
  constructor() { }

  ngOnInit() {
  }

  yearValidate() {
    console.log(this.errorMsg)
  }


  selectedPlatform(obj) {
    if(this.platforms && this.platforms.find(x => x.name === obj.name)) {
      const index = this.platforms.findIndex((x => x.name === obj.name));
      this.platforms[index].exp_year = obj.exp_year;
    }
    else this.platforms.push(obj);
    console.log(this.platforms);
  }

}
