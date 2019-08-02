import { Component, OnInit, Input } from '@angular/core';
import { constants } from '../../../../constants/constants';
import { CommercialSkill} from '../../../../constants/interface';

@Component({
  selector: 'app-i-forme-commercial-skills',
  templateUrl: './commercial-skills.component.html',
  styleUrls: ['./commercial-skills.component.css']
})
export class CommercialSkillsComponent implements OnInit {
  @Input() commercial_skills: CommercialSkill[];
  @Input() description_commercial_skills: string;
  otherSkills = constants.otherSkills;
  experienceYears = constants.experienceYears;
  desErrMsg;
  platform = [];
  yearErrMsg = [];
  platformsYear;

  constructor() {
  }

  ngOnInit() {
    if (this.commercial_skills) {
      for (let commercial of this.commercial_skills) {
        this.platform.push(commercial.skill);
      }
      this.platformsYear = this.commercial_skills;
    }
  }

  selfValidate() {
    if (this.platform && this.platform.length > 0) {
      const desValid = this.desValidate();
      const yearValid = this.yearValidate();
      if (desValid && yearValid) {
        return true;
      }
      else return false;
    }
  }

  yearValidate() {
    this.yearErrMsg = [];
    if(this.platform.length !== this.commercial_skills.filter(i => i.exp_year).length ) {
      for(let i=0 ; i< this.commercial_skills.length; i++) {
        if(!this.commercial_skills[i].exp_year) {
          this.yearErrMsg[i] = 'Please select year of experience';
          return false;
        }
      }
    }

    this.yearErrMsg = [];
    return true;
  }

  oncommerciallyOptions(array) {
    this.commercial_skills = [];
    for(let val of array) {
      this.commercial_skills.push({skill: val, exp_year: ''});
    }

    for(let platform of this.commercial_skills) {
      if(this.platformsYear.find(x=> x.skill === platform.skill)) {
        let object = this.platformsYear.find(x=> x.skill === platform.skill);
        let index = this.commercial_skills.findIndex(x => x.skill === platform.skill);
        this.commercial_skills[index].exp_year = object.exp_year;
      }
    }
  }

  selectedPlatform(obj) {
    if (this.commercial_skills && this.commercial_skills.find(x => x.skill === obj.label)) {
      const index = this.commercial_skills.findIndex((x => x.skill === obj.label));
      this.commercial_skills[index].exp_year = obj.exp_year;
    }
    else this.commercial_skills.push({skill: obj.label, exp_year: obj.exp_year});
  }


  desValidate() {
    if (this.commercial_skills) {
      if (this.commercial_skills.length > 0) {
        if (this.description_commercial_skills && this.description_commercial_skills.length < 100) {
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
