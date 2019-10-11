import { Component, OnInit, Input, Output, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
import { UserService} from '../../../user.service';
import {filter_array, copyObject} from '../../../../services/object';
import {constants} from '../../../../constants/constants';
import { isPlatformBrowser } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-i-forme-skills-auto-suggest',
  templateUrl: './skills-auto-suggest.component.html',
  styleUrls: ['./skills-auto-suggest.component.css']
})
export class SkillsAutoSuggestComponent implements OnInit {
  @Input() selectedSkill: Array<object>;
  @Output() selectedItems: EventEmitter<any> = new EventEmitter<any>();

  errorMsg: string;
  controllerOptions: any = {};
  autoSuggestController;
  resultItemDisplay;object;
  years_exp_min_new = constants.years_exp_min_new;
  selectedSkillExpYear=[];value;exp_year_error = '';yearsErrMsg;

  constructor(private authenticationService: UserService, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh');
      }, 500);
    }
    if(!this.selectedSkill) {
      console.log('in if ngon');
      this.selectedSkill = [];
    }
    else {
      this.selectedSkill.sort(function(a, b){
        if(a['name'] < b['name']) { return -1; }
        if(a['name'] > b['name']) { return 1; }
        return 0;
      });
      console.log(this.selectedSkill);
      this.selectedSkillExpYear = copyObject(this.selectedSkill);
    }

    this.controllerOptions = true;
    this.autoSuggestController = function (textValue, controllerOptions) {
      return this.authenticationService.autoSuggestSkills(textValue);
    };

    this.resultItemDisplay = function (data) {
      const skillsInput = data;
      let skillsOptions = [];
      for(let skill of skillsInput) {
        skillsOptions.push({_id : skill['skill']._id , name : skill['skill'].name, type : skill['skill'].type});
      }
      return filter_array(skillsOptions);
    }
  }

  itemSelected(skillObj){
    let objectMap = {};
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh');
      }, 500);
    }
    if(this.selectedSkillExpYear.find(x => x['name'] === skillObj.name)) {
      this.errorMsg = 'This skills has already been selected';
      return false;
    }
    else {
      objectMap = {skills_id:skillObj._id ,  name: skillObj.name, type: skillObj.type};
      this.selectedSkillExpYear.push(objectMap);
      //else this.selectedSkill.push({ name: skillObj.name, visa_needed: false});
    }
    console.log(this.selectedSkillExpYear);
    this.selectedItems.emit(this.selectedSkillExpYear);
    this.selfValidate();
  }

  selfValidate() {
    console.log('selfValidate');
    this.exp_year_error = '';
    console.log(this.selectedSkillExpYear);
    if(this.selectedSkillExpYear.find(x => (!x['exp_year']))) {
      this.exp_year_error = 'Please select number of years';
      return false;
    }

    if(this.selectedSkillExpYear && this.selectedSkillExpYear.length <= 0) {
      console.log('in if');
      this.errorMsg = "Please select atleast one skill";
      return false;
    }
    if(!this.selectedSkillExpYear) {
      console.log('in if 2nd');
      this.errorMsg = "Please select atleast one skill";
      return false;
    }

    delete this.errorMsg;
    return true;
  }

  skillsExpYearOptions(event, value, index){
    console.log(event.target.value);
    console.log(value);
    console.log(index);
    this.exp_year_error = '';

    this.selectedSkillExpYear[index].exp_year = parseInt(event.target.value);
    console.log(this.selectedSkillExpYear);
    this.selectedItems.emit(this.selectedSkillExpYear);
  }

}
