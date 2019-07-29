import {Component, OnInit, Input} from '@angular/core';
import { constants } from '../../../../constants/constants';
import {CommercialPlatform} from '../../../../constants/interface';

@Component({
  selector: 'app-i-forme-commercial-experience',
  templateUrl: './commercial-experience.component.html',
  styleUrls: ['./commercial-experience.component.css']
})

export class CommercialExperienceComponent implements OnInit {
  @Input() commercial_platforms: CommercialPlatform[];
  @Input() description_commercial_platforms: string;
  blockchainPlatforms = constants.blockchainPlatforms;
  experienceYears = constants.experienceYears;
  desErrMsg;
  platform = [];
  platformsYear;
  yearErrMsg = [];
  constructor() { }

  ngOnInit() {
    if(this.commercial_platforms) {
      for(let commercial of this.commercial_platforms) {
        this.platform.push(commercial.name);
      }
      this.platformsYear = this.commercial_platforms;
    }
  }

  selfValidate() {
    if(this.platform && this.platform.length > 0) {
      const desValid = this.desValidate();
      const yearValid = this.yearValidate();
      if(desValid && yearValid) {
        return true;
      }
      else return false;
    }
  }

  yearValidate() {
    this.yearErrMsg = [];
    if(this.platform.length !== this.commercial_platforms.filter(i => i.exp_year).length ) {
      for(let i=0 ; i< this.commercial_platforms.length; i++) {
        if(!this.commercial_platforms[i].exp_year) {
          this.yearErrMsg[i] = 'Please select year of experience';
          return false;
        }
      }
    }

    this.yearErrMsg = [];
    return true;
  }

  oncommerciallyOptions(array)
  {
    this.commercial_platforms = [];
    for(let val of array) {
     this.commercial_platforms.push({name: val, exp_year: ''});
    }

    for(let platform of this.commercial_platforms) {
      if(this.platformsYear.find(x=> x['name'] === platform.name)) {
        let object = this.platformsYear.find(x=> x['name'] === platform.name);
        let index = this.commercial_platforms.findIndex(x => x.name === platform.name);
        this.commercial_platforms[index].exp_year = object.exp_year;
      }
    }
  }

  selectedPlatform(obj) {
    if(this.commercial_platforms && this.commercial_platforms.find(x => x['name'] === obj.label)) {
      const index = this.commercial_platforms.findIndex((x => x['name'] === obj.label));
      this.commercial_platforms[index].exp_year = obj.exp_year;
    }
    else this.commercial_platforms.push(obj);
  }


  desValidate() {
    if(this.commercial_platforms) {
      if(this.commercial_platforms.length > 0) {
        if(this.description_commercial_platforms && this.description_commercial_platforms.length < 100) {
          this.desErrMsg = 'Please enter minimum 100 characters description';
          return false;
        }
        delete this.desErrMsg;
        return true;
      }
    }
    return true;
  }

}
