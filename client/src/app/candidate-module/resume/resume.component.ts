import { Component, OnInit, Input, Output, EventEmitter, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
import { HttpClient } from '@angular/common/http';
import {NgForm} from '@angular/forms';
import {constants} from '../../../constants/constants';
import {unCheckCheckboxes, filter_array, copyObject} from '../../../services/object';
import { isPlatformBrowser } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css']
})
export class ResumeComponent implements OnInit,AfterViewInit {

  experimented_platform = [];
  commercially_worked = [];
  expYear=[];
  platform=[];expYear_db=[];
  referringData;value;why_work;count=0;exp_class;
  currentUser: User;commercial_expYear=[];db_valye=[];db_lang;
  platforms=[];
  active_class;
  job_active_class;
  exp_active_class;resume_active_class;
  platformreferringData;
  term_active_class;term_link;
  exp_disable;
  error_msg;
  skill_expYear_db=[];
  skillDbArray=[];
  skillDb;
  about_active_class;
  description_commercial_platforms;
  description_experimented_platforms;
  description_commercial_skills;
  commercially;
  otherSkills;
  experimented;
  exp_year;
  area_interested;
  //new ones
  errorMsg: string;
  controllerOptions: any = {};
  autoSuggestController;
  resultItemDisplay;
  object;selectedSkill=[];
  years_exp_min_new = constants.years_exp_min_new;
  skills_years_exp;selectedSkillExpYear=[];
  //end
  constructor(private route: ActivatedRoute, private http: HttpClient,
              private router: Router,
              private authenticationService: UserService,
              @Inject(PLATFORM_ID) private platformId: Object) { }

  ngAfterViewInit(): void
  {
    window.scrollTo(0, 0);

  }
  ngOnInit()
  {
    //new ones
    this.controllerOptions = true;
    this.autoSuggestController = function (textValue, controllerOptions) {
      //console.log(textValue);console.log(controllerOptions);
      return this.authenticationService.autoSuggestSkills(textValue);
    };
    //console.log(this.autoSuggestController);

    this.resultItemDisplay = function (data) {
      const skillsInput = data;
      let citiesOptions = [];
      for(let skill of skillsInput) {
        citiesOptions.push({_id : skill['skill']._id , name : skill['skill'].name, type : skill['skill'].type});

        /*if(cities['remote'] === true) {
          citiesOptions.push({ name: 'Remote'});
        }
        if(cities['city']) {
          const cityString = cities['city'].city + ", " + cities['city'].country + " (city)";
          citiesOptions.push({_id : cities['city']._id , name : cityString});
        }
        if(cities['country'] ) {
          const countryString = cities['country']  + " (country)";
          if(citiesOptions.findIndex((obj => obj.name === countryString)) === -1)
            citiesOptions.push({name: countryString});
        }*/
      }
      return filter_array(citiesOptions);
    }
    //end
    this.commercially = unCheckCheckboxes(constants.blockchainPlatforms);
    this.otherSkills = unCheckCheckboxes(constants.otherSkills);
    this.experimented = unCheckCheckboxes(constants.experimented);
    this.exp_year = unCheckCheckboxes(constants.experienceYears);
    this.area_interested = unCheckCheckboxes(constants.workBlockchainInterests);
    this.exp_disable = "disabled";
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if(!this.currentUser)
    {
      this.router.navigate(['/login']);
    }
    if(this.currentUser && this.currentUser.type=='candidate')
    {
      this.area_interested.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })

      this.commercially.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })

      this.experimented.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })
      this.otherSkills.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })

      this.exp_class="";
      this.active_class="fa fa-check-circle text-success";
      this.authenticationService.getCandidateProfileById(this.currentUser._id, false)
        .subscribe(
          data => {
            if(data['candidate'].terms_id)
            {
              this.term_active_class='fa fa-check-circle text-success';
              this.term_link = '/terms-and-condition';
            }
            if(data['contact_number']  && data['nationality'])
            {
              this.about_active_class = 'fa fa-check-circle text-success';
            }

            if(data['candidate'].employee || data['candidate'].contractor || data['candidate'].volunteer)
            {
              this.job_active_class = 'fa fa-check-circle text-success';
            }

            if(data['candidate'].why_work && data['candidate'].interest_areas )
            {
              this.exp_class = "/experience";
              this.exp_disable = "";
              this.resume_active_class='fa fa-check-circle text-success';
            }

            if( data['candidate'].description)
            {

              this.exp_active_class = 'fa fa-check-circle text-success';
            }

            if(data['candidate'].why_work){

              this.why_work=data['candidate'].why_work;
            }
            if(data['candidate'].interest_areas)
            {
              for (let interest of data['candidate'].interest_areas)
              {

                for(let option of this.area_interested)
                {

                  if(option.value === interest)
                  {
                    option.checked=true;
                    this.selectedValue.push(interest);

                  }

                }

              }
            }
            if(data['candidate'].blockchain)
            {

              if(data['candidate'].blockchain.commercial_platforms)
              {
                this.commercial_expYear =data['candidate'].blockchain.commercial_platforms;
                for (let key of data['candidate'].blockchain.commercial_platforms)
                {
                  for(var i in key)
                  {


                    for(let option of this.commercially)
                    {

                      if(option.value == key[i])
                      {
                        option.checked=true;
                        this.db_valye.push(key[i]);
                        this.db_lang= ({value: key[i]});
                        this.commercially_worked.push(this.db_lang);

                      }
                      else
                      {

                      }

                    }

                    for(let option of this.exp_year)
                    {

                      if(option.value == key[i])
                      {
                        option.checked=true;
                        this.expYear_db.push(key[i]);

                      }

                    }

                  }
                }
              }

              if(data['candidate'].blockchain.description_commercial_skills)
              {
                this.description_commercial_skills = data['candidate'].blockchain.description_commercial_skills;
              }


              if(data['candidate'].blockchain.description_commercial_platforms)
              {
                this.description_commercial_platforms = data['candidate'].blockchain.description_commercial_platforms;
              }


              if(data['candidate'].blockchain.experimented_platforms)
              {
                for (let plat of data['candidate'].blockchain.experimented_platforms)
                {

                  for(let option of this.experimented)
                  {

                    if(option.value === plat)
                    {
                      option.checked=true;
                      this.experimented_platform.push(plat);

                    }

                  }

                }
              }

              if(data['candidate'].blockchain.description_experimented_platforms)
              {
                this.description_experimented_platforms = data['candidate'].blockchain.description_experimented_platforms;
              }

              if(data['candidate'].blockchain.commercial_skills && data['candidate'].blockchain.commercial_skills.length>0)
              {
                this.commercialSkillsExperienceYear = data['candidate'].blockchain.commercial_skills;
                for (let key of data['candidate'].blockchain.commercial_skills)
                {
                  for(var i in key)
                  {

                    for(let option of this.otherSkills)
                    {

                      if(option.value === key[i])
                      {
                        option.checked=true;
                        this.skillDbArray.push(key[i]);
                        this.skillDb= ({value: key[i], name: option.name});
                        this.commercialSkills.push(this.skillDb);

                      }
                      else
                      {

                      }

                    }

                    for(let option of this.exp_year)
                    {

                      if(option.value === key[i])
                      {
                        option.checked=true;
                        this.skill_expYear_db.push(key[i]);

                      }

                    }

                  }
                }
              }

              if(data['candidate'].blockchain.description_commercial_skills)
              {
                this.description_commercial_skills = data['candidate'].blockchain.description_commercial_skills;
              }

            }


            if(data['candidate'].locations && data['candidate'].roles && data['candidate'].interest_areas || data['candidate'].expected_salary || data['candidate'].availability_day ) {
              this.job_active_class = 'fa fa-check-circle text-success';


            }

          },
          error => {
            if(error['message'] === 500 || error['message'] === 401)
            {
              localStorage.setItem('jwt_not_found', 'Jwt token not found');
              localStorage.removeItem('currentUser');
              localStorage.removeItem('googleUser');
              localStorage.removeItem('close_notify');
              localStorage.removeItem('linkedinUser');
              localStorage.removeItem('admin_log');
              window.location.href = '/login';
            }

            if(error['message'] === 403)
            {
              this.router.navigate(['/not_found']);
            }

          });
      //this.router.navigate(['/about']);
    }
    else
    {
      this.router.navigate(['/not_found']);
    }
  }




  onExpOptions(e)
  {

    if(e.target.checked)
    {
      this.experimented_platform.push(e.target.value);
    }
    else{
      let updateItem = this.experimented_platform.find(this.findIndexToUpdateExperimented, e.target.value);

      let index = this.experimented_platform.indexOf(updateItem);

      this.experimented_platform.splice(index, 1);
    }

  }

  onAreaSelected(e)
  {
    if(e.target.checked)
    {
      this.selectedValue.push(e.target.value);
    }
    else{
      let updateItem = this.selectedValue.find(x => x === e.target.value);
      let index = this.selectedValue.indexOf(updateItem);
      this.selectedValue.splice(index, 1);
    }


  }


  findIndexToUpdateExperimented(type) {
    return type == this;
  }

  findIndexToUpdate(obj)
  {
    return obj.value === this;
  }

  why_work_log;commercial_log;
  formal_skills=[];
  commercial_skill_log;
  interest_log;
  commercial_desc_log;
  experimented_desc_log;
  commercialSkills_desc_log;
  max_characters_limit = 40;

  blockchain_exp(expForm: NgForm)
  {
    this.error_msg="";
    let flag_commercial_desc = true;
    let flag_experimented_desc = true;
    let flag_commercialSkills_desc = true;

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(this.commercially_worked.length !== this.commercial_expYear.length )
    {
      this.commercial_log = "Please fill year of experience";
    }
    if(this.commercialSkills.length !== this.commercialSkillsExperienceYear.length)
    {
      this.commercial_skill_log = "Please fill year of experience";
    }

    if(this.selectedValue.length<=0) {
      this.interest_log = "Please select at least one area of interest";
    }
    if(this.commercially_worked.length > 0 && this.description_commercial_platforms && this.description_commercial_platforms.length < this.max_characters_limit){
      flag_commercial_desc = false;
      this.commercial_desc_log = 'Please enter minimum '+this.max_characters_limit+' characters description';
    }

    if(this.experimented_platform.length > 0 && this.description_experimented_platforms && this.description_experimented_platforms.length < this.max_characters_limit){
      flag_experimented_desc = false;
      this.experimented_desc_log = 'Please enter minimum '+this.max_characters_limit+' characters description';
    }

    if(this.commercialSkills.length > 0 && this.description_commercial_skills && this.description_commercial_skills.length < this.max_characters_limit){
      flag_commercialSkills_desc = false;
      this.commercialSkills_desc_log = 'Please enter minimum '+this.max_characters_limit+' characters description';
    }

    if(!this.why_work)
    {
      this.why_work_log = "Please fill why do you want to work on blockchain?";
    }

    if(this.why_work && this.selectedValue.length > 0  && this.commercially_worked.length === this.commercial_expYear.length
      && this.commercialSkills.length === this.commercialSkillsExperienceYear.length
      && flag_commercial_desc && flag_experimented_desc && flag_commercialSkills_desc
    )
    {
      let inputQuery: any = {};
      let candidateQuery:any ={};
      let blockchainQuery:any ={};

      candidateQuery.interest_areas = this.selectedValue;
      candidateQuery.why_work = this.why_work;
      if(this.commercially_worked.length === 0) {
        inputQuery.unset_commercial_platforms = true;
        expForm.value.unset_commercial_platforms = true;
        expForm.value.commercial_platforms = [];
      }
      else {
        blockchainQuery.commercial_platforms = this.commercial_expYear;
        expForm.value.commercial_platforms = this.commercial_expYear;
      }

      if(this.commercialSkills.length === 0) {
        inputQuery.unset_commercial_skills = true;
        expForm.value.unset_commercial_skills = true;
        expForm.value.commercial_skills = [];
      }
      else {
        blockchainQuery.commercial_skills = this.commercialSkillsExperienceYear;
        expForm.value.commercial_skills = this.commercialSkillsExperienceYear;
      }

      expForm.value.description_commercial_platforms = '';
      if(this.description_commercial_platforms){
        blockchainQuery.description_commercial_platforms = this.description_commercial_platforms;
        expForm.value.description_commercial_platforms = this.description_commercial_platforms;
      }

      expForm.value.description_experimented_platforms = '';
      if(this.description_experimented_platforms){
        blockchainQuery.description_experimented_platforms = this.description_experimented_platforms;
        expForm.value.description_experimented_platforms = this.description_experimented_platforms;
      }

      expForm.value.description_commercial_skills = '';
      if(this.description_commercial_skills){
        blockchainQuery.description_commercial_skills = this.description_commercial_skills;
        expForm.value.description_commercial_skills = this.description_commercial_skills;
      }

      if(this.experimented_platform.length === 0) {
        inputQuery.unset_experimented_platforms = true;
        expForm.value.unset_experimented_platforms = true;
      }
      else {
        blockchainQuery.experimented_platforms = this.experimented_platform;
        expForm.value.experimented_platform = this.experimented_platform;
      }

      candidateQuery.blockchain = blockchainQuery;
      inputQuery.candidate = candidateQuery;
      inputQuery.wizardNum = 4;

      this.authenticationService.edit_candidate_profile(this.currentUser._id , inputQuery,false)
        .subscribe(
          data => {
            if(data && this.currentUser)
            {
              this.router.navigate(['/experience']);
              //window.location.href = '/experience';
            }


          },
          error => {

            if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false)
            {
              this.router.navigate(['/not_found']);
            }

          });
    }
    else{
      this.error_msg = "One or more fields need to be completed. Please scroll up to see which ones.";

    }
  }

  oncommerciallyOptions(obj)
  {
    let updateItem = this.commercially_worked.find(this.findIndexToUpdate, obj.value);
    let index = this.commercially_worked.indexOf(updateItem);
    if(index > -1)
    {
      this.commercially_worked.splice(index, 1);
      let updateItem2 = this.findObjectByKey(this.commercial_expYear, 'name',  obj.value);
      let index2 = this.commercial_expYear.indexOf(updateItem2);

      if(index2 > -1)
      {

        this.commercial_expYear.splice(index2, 1);
      }
    }
    else
    {
      obj.checked =true;
      this.commercially_worked.push(obj);
    }
  }

  onExpYearOptions(e , value)
  {

    this.langValue = value;
    let updateItem = this.findObjectByKey(this.expYear, 'experimented_platform', value);
    let index = this.expYear.indexOf(updateItem);

    if(index > -1)
    {

      this.expYear.splice(index, 1);
      this.value=value;
      this.referringData = { experimented_platform:this.value, exp_year: e.target.value};
      this.expYear.push(this.referringData);

    }
    else
    {
      this.value=value;
      this.referringData = { experimented_platform :this.value, exp_year: e.target.value};
      this.expYear.push(this.referringData);

    }

  }

  selectedValue=[];langValue;
  onComExpYearOptions(e, value)
  {
    this.langValue = value;
    let updateItem = this.findObjectByKey(this.commercial_expYear, 'name', value);
    let index = this.commercial_expYear.indexOf(updateItem);

    if(index > -1)
    {

      this.commercial_expYear.splice(index, 1);
      this.value=value;
      this.referringData = { name :this.value, exp_year: e.target.value};
      this.commercial_expYear.push(this.referringData);

    }
    else
    {
      this.value=value;
      this.referringData = { name :this.value, exp_year: e.target.value};
      this.commercial_expYear.push(this.referringData);
    }
    this.commercial_expYear.sort(function(a, b){
      if(a.name < b.name) { return -1; }
      if(a.name > b.name) { return 1; }
      return 0;
    })

  }


  onPlatformYearOptions(e, value)
  {
    this.langValue = value;
    /*this.value=value;
    this.platformreferringData = { name:this.value, exp_year: e.target.value};
    this.platforms.push(this.platformreferringData);
    */

    let updateItem = this.findObjectByKey(this.platforms, 'name', value);
    let index = this.platforms.indexOf(updateItem);

    if(index > -1)
    {

      this.platforms.splice(index, 1);
      this.value=value;
      this.platformreferringData = { name:this.value, exp_year: e.target.value};
      this.platforms.push(this.platformreferringData);

    }
    else
    {
      this.value=value;
      this.platformreferringData = { name:this.value, exp_year: e.target.value};
      this.platforms.push(this.platformreferringData);

    }
    this.platforms.sort(function(a, b){
      if(a.name < b.name) { return -1; }
      if(a.name > b.name) { return 1; }
      return 0;
    })
  }



  findObjectByKey(array, key, value)
  {
    for (var i = 0; i < array.length; i++)
    {
      if (array[i][key] === value)
      {
        return array[i];
      }

    }
    return null;
  }

  commercialSkills=[];
  commercialSkillsExperienceYear=[];

  oncommercialSkillsOptions(obj)
  {

    let updateItem = this.commercialSkills.find(this.findIndexToUpdate, obj.value);
    let index = this.commercialSkills.indexOf(updateItem);
    if(index > -1)
    {
      this.commercialSkills.splice(index, 1);
      let updateItem2 = this.findObjectByKey(this.commercialSkillsExperienceYear, 'skill',  obj.value);
      let index2 = this.commercialSkillsExperienceYear.indexOf(updateItem2);

      if(index2 > -1)
      {

        this.commercialSkillsExperienceYear.splice(index2, 1);
      }
    }
    else
    {
      obj.checked =true;
      this.commercialSkills.push(obj);
    }

  }

  onComSkillExpYearOptions(e, value)
  {
    let updateItem = this.findObjectByKey(this.commercialSkillsExperienceYear, 'skill', value);
    let index = this.commercialSkillsExperienceYear.indexOf(updateItem);

    if(index > -1)
    {

      this.commercialSkillsExperienceYear.splice(index, 1);
      this.value = value;
      this.referringData = { skill : this.value, exp_year: e.target.value};
      this.commercialSkillsExperienceYear.push(this.referringData);

    }
    else
    {
      this.value=value;
      this.referringData = { skill : this.value, exp_year: e.target.value};
      this.commercialSkillsExperienceYear.push(this.referringData);

    }
    this.commercialSkillsExperienceYear.sort(function(a, b){
      if(a.skill < b.skill) { return -1; }
      if(a.skill > b.skill) { return 1; }
      return 0;
    })

  }

  itemSelected(skillObj){
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh');
      }, 500);
    }
    if(this.selectedSkill.find(x => x['name'] === skillObj.name)) {
      this.errorMsg = 'This skills has already been selected';
      return false;
      if (isPlatformBrowser(this.platformId)) {
        setInterval(() => {
          delete this.errorMsg;
          return true;
        }, 3000);
      }
    }
    else {
      if(skillObj) this.selectedSkill.push({_id:skillObj._id ,  name: skillObj.name, type: skillObj.type});
      else this.selectedSkill.push({ name: skillObj.name, visa_needed: false});
    }
    this.selectedSkillExpYear = copyObject(this.selectedSkill);
    console.log(this.selectedSkill);
  }

  selfValidate() {
    console.log('selfValidate');
    if(this.selectedSkill && this.selectedSkill.length < 0) {
      this.errorMsg = "Please select atleast one skill";
      return false;
    }
    if(!this.selectedSkill) {
      this.errorMsg = "Please select atleast one skill";
      return false;
    }

    delete this.errorMsg;
    return true;
  }

  skillsExpYearOptions(event, value){
    console.log(this.selectedSkillExpYear);
    let updateItem = this.findObjectByKey(this.selectedSkillExpYear, 'name', value.name);
    let index = this.selectedSkillExpYear.indexOf(updateItem);
    console.log(index);

    if(index > -1) {
      this.value=value;
      this.selectedSkillExpYear.splice(index, 1);
      this.referringData = {
        _id: this.value._id,
        name : this.value.name,
        type : this.value.type,
        exp_year: parseInt(event.target.value)
      };
      //this.selectedSkillExpYear.splice(index, 1, this.referringData);
      this.selectedSkillExpYear.push(this.referringData);

    }
    else {
      this.value=value;
      this.referringData = {
        _id: this.value._id,
        name : this.value.name,
        type : this.value.type,
        exp_year: parseInt(event.target.value)
      };
      this.selectedSkillExpYear.push(this.referringData);
      //this.selectedSkillExpYear.splice(index, 1, this.referringData);
    }
    /*this.selectedSkill.sort(function(a, b){
      if(a.name < b.name) { return -1; }
      if(a.name > b.name) { return 1; }
      return 0;
    });*/

    console.log(this.selectedSkillExpYear);
  }

}
