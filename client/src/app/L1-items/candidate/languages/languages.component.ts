import { Component, OnInit, Input } from '@angular/core';
import { constants } from '../../../../constants/constants';
import { Language } from '../../../../constants/interface';

@Component({
  selector: 'app-i-forme-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.css']
})
export class LanguagesComponent implements OnInit {
  @Input() programming_languages: Language[];
  languages = constants.programmingLanguages;
  experienceYears = constants.experienceYears;
  platform = [];
  yearErrMsg = [];
  platformsYear;
  constructor() { }

  ngOnInit() {
    this.languages.sort(function(a, b){
      if(a.name < b.name) { return -1; }
      if(a.name > b.name) { return 1; }
      return 0;
    });

    if(this.programming_languages) {
      for(let language of this.programming_languages) {
        this.platform.push(language['language']);
      }
      this.platformsYear = this.programming_languages;
    }
  }

  selfValidate() {
    this.yearErrMsg = [];
    if(this.platform.length !== this.programming_languages.filter(i => i['exp_year']).length ) {
      for(let i=0 ; i< this.programming_languages.length; i++) {
        if(!this.programming_languages[i]['exp_year']) {
          this.yearErrMsg[i] = 'Please select year of experience';
          return false;
        }
      }
    }
    this.yearErrMsg = [];
    return true;
  }

  onlanguagesOptions(array)
  {
    this.programming_languages = [];
    for(let val of array) {
      this.programming_languages.push({language: val, exp_year: ''});
    }

    for(let platform of this.programming_languages) {
      if(this.platformsYear.find(x=> x.language === platform['language'])) {
        let object = this.platformsYear.find(x=> x.language === platform['language']);
        let index = this.programming_languages.findIndex(x => x['language'] === platform['language']);
        this.programming_languages[index]['exp_year'] = object.exp_year;
      }
    }
  }

  selectedPlatform(obj) {
    if(this.programming_languages && this.programming_languages.find(x => x['language'] === obj.label)) {
      const index = this.programming_languages.findIndex((x => x['language'] === obj.label));
      this.programming_languages[index]['exp_year'] = obj.exp_year;
    }
    else this.programming_languages.push(obj);
  }

}
