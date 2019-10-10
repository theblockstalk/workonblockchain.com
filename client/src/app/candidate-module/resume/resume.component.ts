import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
import { HttpClient } from '@angular/common/http';
import {NgForm} from '@angular/forms';
import {constants} from '../../../constants/constants';
import {unCheckCheckboxes} from '../../../services/object';
import {SkillsAutoSuggestComponent} from '../../L1-items/users/skills-auto-suggest/skills-auto-suggest.component';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css']
})
export class ResumeComponent implements OnInit,AfterViewInit {
  @ViewChild(SkillsAutoSuggestComponent) skillsAutoSuggestComp: SkillsAutoSuggestComponent;

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
  //new for skill component
  skillsFromDB;selectedSkillsNew;

  constructor(private route: ActivatedRoute, private http: HttpClient,
              private router: Router,
              private authenticationService: UserService) { }

  ngAfterViewInit(): void {
    window.scrollTo(0, 0);

  }
  ngOnInit()
  {
    //get skills from DB and send to skills component
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

  blockchain_exp(expForm: NgForm) {
    this.error_msg="";
    let flag_commercial_desc = true;
    let flag_experimented_desc = true;
    let flag_commercialSkills_desc = true;
    let errorCount = 0;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if(!this.skillsAutoSuggestComp.selfValidate()) {
      console.log('in resume valid error');
      errorCount = 1;
    }

    if(this.selectedValue.length<=0) {
      this.interest_log = "Please select at least one area of interest";
    }
    /*if(this.commercially_worked.length > 0 && this.description_commercial_platforms && this.description_commercial_platforms.length < this.max_characters_limit){
      flag_commercial_desc = false;
      this.commercial_desc_log = 'Please enter minimum '+this.max_characters_limit+' characters description';
    }*/

    if(!this.why_work) {
      this.why_work_log = "Please fill why do you want to work on blockchain?";
    }

    if(errorCount === 0 && this.why_work && this.selectedValue.length > 0) {
      let inputQuery: any = {};
      let candidateQuery:any ={};
      let blockchainQuery:any ={};

      candidateQuery.interest_areas = this.selectedValue;
      candidateQuery.why_work = this.why_work;
      candidateQuery.commercial_skills = this.selectedSkillsNew;


      /*expForm.value.description_commercial_platforms = '';
      if(this.description_commercial_platforms){
        blockchainQuery.description_commercial_platforms = this.description_commercial_platforms;
        expForm.value.description_commercial_platforms = this.description_commercial_platforms;
      }*/

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

}
