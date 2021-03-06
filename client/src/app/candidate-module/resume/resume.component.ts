import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
import { HttpClient } from '@angular/common/http';
import {NgForm} from '@angular/forms';
import {constants} from '../../../constants/constants';
import {unCheckCheckboxes} from '../../../services/object';
import {SkillsAutoSuggestComponent} from '../../L1-items/users/skills-auto-suggest/skills-auto-suggest.component';
import {NotRequireSkillsComponent} from '../../L1-items/users/not-require-skills/not-require-skills.component';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css']
})
export class ResumeComponent implements OnInit,AfterViewInit {
  @ViewChild(SkillsAutoSuggestComponent) skillsAutoSuggestComp: SkillsAutoSuggestComponent;
  @ViewChild(NotRequireSkillsComponent) notRequiredSkills: NotRequireSkillsComponent;

  why_work;exp_class;currentUser: User;
  active_class;job_active_class;exp_active_class;resume_active_class;
  term_active_class;term_link;exp_disable;error_msg;about_active_class;
  selectedValue=[];
  area_interested;why_work_log;interest_log;
  //new for commercial skills component
  commercialSkillsFromDB;selectedCommercialSkillsNew;description_commercial_skills;
  nonCommercialSkillsDB;selectedNonCommercialSkills;descriptionNonCommercialSkills;

  constructor(private route: ActivatedRoute, private http: HttpClient,
              private router: Router,
              private authenticationService: UserService) { }

  ngAfterViewInit(): void {
    window.scrollTo(0, 0);
  }
  ngOnInit() {
    this.area_interested = unCheckCheckboxes(constants.workBlockchainInterests);
    this.exp_disable = "disabled";
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if(!this.currentUser) {
      this.router.navigate(['/login']);
    }
    if(this.currentUser && this.currentUser.type=='candidate') {
      this.area_interested.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      });

      this.exp_class="";
      this.active_class="fa fa-check-circle text-success";
      this.authenticationService.getCandidateProfileById(this.currentUser._id, false)
        .subscribe(
          data => {
            if(data['candidate'].terms_id) {
              this.term_active_class='fa fa-check-circle text-success';
              this.term_link = '/terms-and-condition';
            }
            if(data['contact_number']  && data['nationality']) {
              this.about_active_class = 'fa fa-check-circle text-success';
            }

            if(data['candidate'].employee || data['candidate'].contractor || data['candidate'].volunteer) {
              this.job_active_class = 'fa fa-check-circle text-success';
            }

            if(data['candidate'].commercial_skills && data['candidate'].why_work && data['candidate'].interest_areas ) {
              this.exp_class = "/experience";
              this.exp_disable = "";
              this.resume_active_class='fa fa-check-circle text-success';
            }

            if( data['candidate'].description) {
              this.exp_active_class = 'fa fa-check-circle text-success';
            }

            if(data['candidate'].why_work){
              this.why_work=data['candidate'].why_work;
            }
            if(data['candidate'].interest_areas) {
              for (let interest of data['candidate'].interest_areas) {
                for(let option of this.area_interested) {
                  if(option.value === interest) {
                    option.checked=true;
                    this.selectedValue.push(interest);
                  }
                }
              }
            }
            if(data['candidate'].commercial_skills){
              this.commercialSkillsFromDB = data['candidate'].commercial_skills;
              console.log(this.commercialSkillsFromDB);
            }
            if(data['candidate'].description_commercial_skills){
              this.description_commercial_skills = data['candidate'].description_commercial_skills;
            }
            if(data['candidate'].skills) this.nonCommercialSkillsDB = data['candidate'].skills;
            if(data['candidate'].description_skills) this.descriptionNonCommercialSkills = data['candidate'].description_skills;

            if(data['candidate'].locations && data['candidate'].roles && data['candidate'].interest_areas || data['candidate'].expected_salary || data['candidate'].availability_day ) {
              this.job_active_class = 'fa fa-check-circle text-success';
            }
          },
          error => {
            if(error['message'] === 500 || error['message'] === 401) {
              localStorage.setItem('jwt_not_found', 'Jwt token not found');
              localStorage.removeItem('currentUser');
              localStorage.removeItem('googleUser');
              localStorage.removeItem('close_notify');
              localStorage.removeItem('linkedinUser');
              localStorage.removeItem('admin_log');
              window.location.href = '/login';
            }
            if(error['message'] === 403) {
              this.router.navigate(['/not_found']);
            }
          });
      //this.router.navigate(['/about']);
    }
    else {
      this.router.navigate(['/not_found']);
    }
  }

  onAreaSelected(e) {
    if(e.target.checked) {
      this.selectedValue.push(e.target.value);
    }
    else{
      let updateItem = this.selectedValue.find(x => x === e.target.value);
      let index = this.selectedValue.indexOf(updateItem);
      this.selectedValue.splice(index, 1);
    }
  }

  blockchain_exp(expForm: NgForm) {
    this.error_msg="";
    let errorCount = 0;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    //if(!this.skillsAutoSuggestComp.selfValidate()) errorCount = 1;

    if(!this.skillsAutoSuggestComp.desValidate()) errorCount = 1;

    if(!this.notRequiredSkills.desValidate()) errorCount = 1;

    if(this.selectedValue.length<=0) {
      this.interest_log = "Please select at least one area of interest";
    }

    if(!this.why_work) {
      this.why_work_log = "Please fill why do you want to work on blockchain?";
    }

    if(errorCount === 0 && this.why_work && this.selectedValue.length > 0) {
      let inputQuery: any = {};
      let candidateQuery:any ={};

      candidateQuery.interest_areas = this.selectedValue;
      candidateQuery.why_work = this.why_work;
      let setDesc = 1;

      if(this.selectedCommercialSkillsNew && this.selectedCommercialSkillsNew.length > 0)
        candidateQuery.commercial_skills = this.mapSkills(this.selectedCommercialSkillsNew);
      else if(this.skillsAutoSuggestComp.selectedSkillExpYear && this.skillsAutoSuggestComp.selectedSkillExpYear.length > 0)
        candidateQuery.commercial_skills = this.mapSkills(this.skillsAutoSuggestComp.selectedSkillExpYear);
      else {
        setDesc = 0;
        inputQuery.unset_commercial_skills = true;
      }

      if(setDesc && this.skillsAutoSuggestComp.description)
        candidateQuery.description_commercial_skills = this.skillsAutoSuggestComp.description;
      else
        inputQuery.unset_description_commercial_skills = true;

      //for non commercial skills
      setDesc = 1;
      if(this.selectedNonCommercialSkills && this.selectedNonCommercialSkills.length > 0)
        candidateQuery.skills = this.mapSkills(this.selectedNonCommercialSkills);
      else if(this.notRequiredSkills.selectedSkillExpYear && this.notRequiredSkills.selectedSkillExpYear.length > 0)
        candidateQuery.skills = this.mapSkills(this.notRequiredSkills.selectedSkillExpYear);
      else {
        setDesc = 0;
        inputQuery.unset_skills = true;
      }

      if(setDesc && this.notRequiredSkills.description)
        candidateQuery.description_skills = this.notRequiredSkills.description;
      else
        inputQuery.unset_description_skills = true;

      inputQuery.candidate = candidateQuery;
      inputQuery.wizardNum = 4;

      this.authenticationService.edit_candidate_profile(this.currentUser._id , inputQuery,false)
        .subscribe(
          data => {
            if(data && this.currentUser) {
              this.router.navigate(['/experience']);
              //window.location.href = '/experience';
            }
          },
          error => {

            if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              this.router.navigate(['/not_found']);
            }
          });
    }
    else {
      this.error_msg = "One or more fields need to be completed. Please scroll up to see which ones.";
    }
  }

  mapSkills(skills){
    let newCommercialSkills = [];
    for (let skill of skills) {
      let obj = {
        skills_id: skill.skills_id,
        name: skill.name,
        type: skill.type
      };
      if(skill.exp_year) obj['exp_year'] = skill.exp_year;
      newCommercialSkills.push(obj);
    }
    return newCommercialSkills;
  }

}
