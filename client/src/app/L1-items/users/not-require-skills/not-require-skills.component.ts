import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService} from '../../../user.service';
import { copyObject, makeImgCode, makeIconCode} from '../../../../services/object';
import {constants} from '../../../../constants/constants';

@Component({
  selector: 'app-i-forme-not-require-skills',
  templateUrl: './not-require-skills.component.html',
  styleUrls: ['./not-require-skills.component.css']
})
export class NotRequireSkillsComponent implements OnInit {
  @Input() selectedSkill: Array<object>;
  @Input() placeHolder: string;
  @Input() description: string;
  @Output() selectedItems: EventEmitter<any> = new EventEmitter<any>();

  errorMsg: string;
  controllerOptions: any = {};
  autoSuggestController;
  resultItemDisplay;object;
  selectedSkillExpYear=[];exp_year_error = '';desErrMsg;

  constructor(private authenticationService: UserService) { }

  ngOnInit() {
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
  }
}
