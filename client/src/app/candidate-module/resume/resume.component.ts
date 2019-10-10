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

  why_work;exp_class;currentUser: User;
  active_class;job_active_class;exp_active_class;resume_active_class;
  term_active_class;term_link;exp_disable;error_msg;about_active_class;
  selectedValue=[];
  area_interested;why_work_log;interest_log;
  //new for skill component
  skillsFromDB;selectedSkillsNew;

  constructor(private route: ActivatedRoute, private http: HttpClient,
              private router: Router,
              private authenticationService: UserService) { }

  ngAfterViewInit(): void {
    window.scrollTo(0, 0);
  }
  ngOnInit() {
    //get skills from DB and send to skills component
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

            if(data['candidate'].why_work && data['candidate'].interest_areas ) {
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
            console.log(this.selectedValue);
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
    else {
      this.error_msg = "One or more fields need to be completed. Please scroll up to see which ones.";
    }
  }

}
