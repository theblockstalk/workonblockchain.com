import { Component, OnInit, Input } from '@angular/core';
import { constants } from '../../../../constants/constants';

@Component({
  selector: 'app-i-forme-commercial-skills',
  templateUrl: './commercial-skills.component.html',
  styleUrls: ['./commercial-skills.component.css']
})
export class CommercialSkillsComponent implements OnInit {
  @Input() commercial_skills = [];
  @Input() description_commercial_skills: string;
  otherSkills = constants.otherSkills;
  experienceYears = constants.experienceYears;
  desErrMsg;
  platform = [];
  yearErrMsg;

  constructor() {
  }

  ngOnInit() {
    if (this.commercial_skills) {
      for (let commercial of this.commercial_skills) {
        this.platform.push(commercial.skill);
      }
    }
  }

  selfValidate() {
    if (this.platform && this.platform.length > 0) {
      const desValid = this.desValidate();
      const yearValid = this.yearValidate();
      if (desValid && yearValid) {
        console.log(this.commercial_skills);
        return true;
      }
      else return false;
    }
  }

  yearValidate() {
    console.log(this.commercial_skills.filter(i => i.exp_year).length);
    console.log(this.platform.length);
    if (this.platform.length !== this.commercial_skills.filter(i => i.exp_year).length) {
      this.yearErrMsg = 'Please select all year of experince';
      return false;
    }
    delete this.yearErrMsg;
    return true;
  }

  oncommerciallyOptions(array) {
    this.platform = array;
    for (let val of array) {
      if (this.commercial_skills && this.commercial_skills.find(x => x.skill === val)) {
      }
      else this.commercial_skills.push({skill: val});
    }
  }

  selectedPlatform(obj) {
    if (this.commercial_skills && this.commercial_skills.find(x => x.skill === obj.label)) {
      const index = this.commercial_skills.findIndex((x => x.skill === obj.label));
      this.commercial_skills[index].exp_year = obj.exp_year;
    }
    else this.commercial_skills.push({skill: obj.label, exp_year: obj.exp_year});
    console.log(this.commercial_skills);
  }


  desValidate() {
    if (this.commercial_skills) {
      if (this.commercial_skills.length > 0) {
        if (!this.description_commercial_skills) {
          this.desErrMsg = 'Please enter description';
          return false;
        }
        delete this.desErrMsg;
        return true;
      }
    }
    return true;
  }
}
