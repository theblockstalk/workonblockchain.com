import { Component, OnInit, Input, Output, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
import { UserService} from '../../../user.service';
import { copyObject, makeImgCode, makeIconCode} from '../../../../services/object';
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
  @Input() placeHolder: string;
  @Input() showDescription: Boolean;
  @Input() description: string;
  @Input() compSearch: Boolean;
  @Input() noExpYears: Boolean;
  @Output() selectedItems: EventEmitter<any> = new EventEmitter<any>();

  //[ngClass]="wizard.disableClass === true? 'disabled': ''"
  errorMsg: string;
  controllerOptions: any = {};
  autoSuggestController;
  resultItemDisplay;object;
  years_exp_min_new = constants.years_exp_min_new;
  selectedSkillExpYear=[];value;exp_year_error = '';yearsErrMsg;
  desErrMsg;
  //classes for search display proper
  mainClass = 'col-md-8 p-1';nameClass = 'col-4';yearsClass='col-4';
  deleteRowClass='col-4';

  constructor(private authenticationService: UserService, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    if(this.compSearch){
      this.mainClass = 'col-md-12 p-1';
      this.nameClass = 'col-12';
      this.yearsClass='col-9';
      this.deleteRowClass='col-2';
    }
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh');
      }, 500);
    }

    if(!this.selectedSkill) this.selectedSkill = [];
    else {
      for(let skillDB of this.selectedSkill){
        if(skillDB['type'] === 'blockchain')
          skillDB['img'] = makeImgCode(skillDB);
        if(skillDB['type'] === 'language')
          skillDB['img'] = makeIconCode('fas fa-code');
        if(skillDB['type'] === 'experience')
          skillDB['img'] = makeIconCode('fas fa-user-friends');
      }
      this.selectedSkillExpYear = copyObject(this.selectedSkill);
    }

    this.controllerOptions = true;
    this.autoSuggestController = function (textValue, controllerOptions) {
      return this.authenticationService.autoSuggestSkills(textValue);
    };

    this.resultItemDisplay = function (data) {
      const skillsInput = data;
      let skillsOptions = [];
      for(let skill of skillsInput['skills']) {
        let obj = {
          _id: skill['skill']._id,
          name: skill['skill'].name,
          type: skill['skill'].type
        };
        if(skill['skill'].type === 'blockchain')
          obj['img'] = makeImgCode(skill['skill']);
        if(skill['skill'].type === 'language')
          obj['img'] = makeIconCode('fas fa-code');
        if(skill['skill'].type === 'experience')
          obj['img'] = makeIconCode('fas fa-user-friends');
        skillsOptions.push(obj);
      }
      return skillsOptions;
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
      if(skillObj.type === 'blockchain')
        objectMap['img'] = makeImgCode(skillObj);
      if(skillObj.type === 'language')
        objectMap['img'] = makeIconCode('fas fa-code');
      if(skillObj.type === 'experience')
        objectMap['img'] = makeIconCode('fas fa-user-friends');
      this.selectedSkillExpYear.push(objectMap);
      //else this.selectedSkill.push({ name: skillObj.name, visa_needed: false});
    }
    this.selectedItems.emit(this.selectedSkillExpYear);
    if(!this.compSearch && !this.showDescription)
      this.selfValidate();
  }

  selfValidate() {
    this.exp_year_error = '';
    this.errorMsg = '';
    /*if(!this.noExpYears && this.selectedSkillExpYear.find(x => (!x['exp_year']))) {
      this.exp_year_error = 'Please select number of years';
      return false;
    }*/

    if(this.selectedSkillExpYear && this.selectedSkillExpYear.length <= 0) {
      this.errorMsg = "Please select atleast one skill";
      return false;
    }
    if(!this.selectedSkillExpYear) {
      this.errorMsg = "Please select atleast one skill";
      return false;
    }

    delete this.errorMsg;
    return true;
  }

  skillsExpYearOptions(event, value, index){
    this.exp_year_error = '';

    this.selectedSkillExpYear[index].exp_year = parseInt(event.target.value);
    this.selectedItems.emit(this.selectedSkillExpYear);
  }

  desValidate() {
    if (this.selectedSkillExpYear) {
      if (this.selectedSkillExpYear.length > 0) {
        if (this.description && this.description.length < 40) {
          this.desErrMsg = 'Please enter minimum 40 characters description';
          return false;
        }
        delete this.desErrMsg;
        return true;
      }
    }
    return true;
  }

  deleteRow(index){
    this.selectedSkillExpYear.splice(index, 1);
    this.selectedItems.emit(this.selectedSkillExpYear);
    if(!this.compSearch && !this.showDescription)
      this.selfValidate();
  }

}
